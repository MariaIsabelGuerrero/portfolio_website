import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

// ---- Rate Limiting ----
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 3;         // max 3 messages
const RATE_LIMIT_WINDOW = 60000;  // per 1 minute (60 seconds)

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

// Clean up old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.lastReset > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// ---- Routes ----

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const status = request.nextUrl.searchParams.get("status");

    let result;
    if (status === "read") {
      result = await db.select().from(messages).where(eq(messages.read, true)).orderBy(desc(messages.date));
    } else if (status === "unread") {
      result = await db.select().from(messages).where(eq(messages.read, false)).orderBy(desc(messages.date));
    } else {
      result = await db.select().from(messages).orderBy(desc(messages.date));
    }

    return NextResponse.json({ data: result, count: result.length });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Public endpoint - contact form submission (no auth required)
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message, turnstileToken, website } = body;

    // Honeypot check - real users never fill this hidden field
    if (website) {
      return NextResponse.json({ error: "Spam detected" }, { status: 403 });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Verify Cloudflare Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Turnstile verification is required" },
        { status: 400 }
      );
    }

    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecretKey) {
      console.error("TURNSTILE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Call Cloudflare's siteverify API
    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: turnstileSecretKey,
          response: turnstileToken,
        }),
      }
    );

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      console.error("Turnstile verification failed:", turnstileResult);
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 403 }
      );
    }

    // Turnstile passed — save the message
    const id = crypto.randomUUID();
    const [created] = await db.insert(messages).values({
      id,
      name,
      email,
      message,
    }).returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
