import { auth, db } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { checkAccountLockout, recordLoginAttempt } from "@/lib/security/account-lockout";
import { logAuthEvent } from "@/lib/security/audit-log";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/db/schema";

const handler = toNextJsHandler(auth);

function getClientInfo(request: NextRequest): { ipAddress?: string; userAgent?: string } {
  return {
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               request.headers.get("cf-connecting-ip") ||
               undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    return await handler.GET(request);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Better Auth GET error:", error);
    }
    throw error;
  }
}

interface SignInBody {
  email?: string;
  rememberMe?: boolean;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const isSignIn = url.pathname.includes("/sign-in/email");

  if (isSignIn) {
    let body: SignInBody | null = null;
    let bodyString: string | null = null;

    try {
      body = await request.json();
      bodyString = JSON.stringify(body);
      const email = body?.email;

      if (email && typeof email === "string") {
        // Check account lockout
        const lockoutStatus = await checkAccountLockout(email);
        if (lockoutStatus.isLocked) {
          const clientInfo = getClientInfo(request);
          await recordLoginAttempt(email, false, clientInfo.ipAddress, clientInfo.userAgent);

          const expiryDate = lockoutStatus.lockoutExpiresAt
            ? new Date(lockoutStatus.lockoutExpiresAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
            : null;

          const lockoutMessage = expiryDate
            ? `Your account has been temporarily locked due to too many failed login attempts. Please try again after ${expiryDate}.`
            : "Your account has been temporarily locked due to too many failed login attempts. Please try again later.";

          return NextResponse.json(
            { error: { message: lockoutMessage } },
            { status: 423 }
          );
        }

        // Check if user exists and email is verified
        const users = await db.select().from(schema.user).where(eq(schema.user.email, email)).limit(1);
        const user = users[0];

        if (user && !user.emailVerified) {
          const clientInfo = getClientInfo(request);
          await recordLoginAttempt(email, false, clientInfo.ipAddress, clientInfo.userAgent);

          return NextResponse.json(
            { error: { message: "Please verify your email address before logging in." } },
            { status: 403 }
          );
        }
      }

      // Create new request with stored body
      const newRequest = new NextRequest(request.url, {
        method: request.method,
        headers: request.headers,
        body: bodyString,
      });

      const response = await handler.POST(newRequest);

      // Record login attempt
      if (email && typeof email === "string") {
        const clientInfo = getClientInfo(request);
        const success = response.status === 200 || response.status === 201;
        await recordLoginAttempt(email, success, clientInfo.ipAddress, clientInfo.userAgent);

        await logAuthEvent(
          "login",
          null,
          success,
          request,
          { email }
        );
      }

      return response;
    } catch (error) {
      if (bodyString) {
        try {
          const reconstructedRequest = new NextRequest(request.url, {
            method: request.method,
            headers: request.headers,
            body: bodyString,
          });
          return handler.POST(reconstructedRequest);
        } catch {
          throw error;
        }
      }
      throw error;
    }
  }

  // For non-sign-in requests, use the original handler
  try {
    return await handler.POST(request);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Better Auth POST error:", error);
    }
    throw error;
  }
}
