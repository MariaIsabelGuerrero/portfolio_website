import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { contact, messages } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendFormSubmitNotification(
  recipientEmail: string,
  name: string,
  email: string,
  message: string
): Promise<void> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("message", message);
  formData.append("_subject", "New Message from Portfolio Website");
  formData.append("_captcha", "false");
  formData.append("_template", "table");

  try {
    const response = await fetch(
      `https://formsubmit.co/${encodeURIComponent(recipientEmail)}`,
      { method: "POST", body: formData }
    );
    if (!response.ok) {
      console.error("FormSubmit notification failed:", response.status);
    }
  } catch (error) {
    console.error("FormSubmit notification failed:", error);
  }
}

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
    const { turnstileToken, website } = body;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // Honeypot check - real users never fill this hidden field
    if (typeof website === "string" && website.trim()) {
      return NextResponse.json({ error: "Spam detected" }, { status: 403 });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (name.length > 100 || email.length > 254 || message.length > 1000) {
      return NextResponse.json(
        { error: "One or more fields exceed the maximum length" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
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
          remoteip: ip !== "unknown" ? ip : undefined,
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

    const [contactRow] = await db
      .select({ email: contact.email })
      .from(contact)
      .where(eq(contact.id, "default"))
      .limit(1);

    if (contactRow?.email) {
      await sendFormSubmitNotification(contactRow.email, name, email, message);
    }

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
