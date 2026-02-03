import { auth, db } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import {
  checkAccountLockout,
  recordLoginAttempt,
} from "@/lib/security/account-lockout";
import { logAuthEvent } from "@/lib/security/audit-log";
import {
  isNewIP,
  recordLoginIP,
  checkSuspiciousActivity,
} from "@/lib/security/ip-security";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/db/schema";

// Validate environment when this route is actually called (runtime)
if (typeof window === "undefined" && process.env.DATABASE_URL) {
  const betterAuthSecret =
    process.env.BETTER_AUTH_SECRET || process.env.AUTH_JWT_SECRET;
  const jwtSecret =
    process.env.BETTER_AUTH_JWT_SECRET ||
    process.env.AUTH_JWT_SECRET ||
    process.env.BETTER_AUTH_SECRET;

  if (betterAuthSecret && betterAuthSecret.length < 32) {
    throw new Error(
      "BETTER_AUTH_SECRET or AUTH_JWT_SECRET must be at least 32 characters long."
    );
  }
  if (jwtSecret && jwtSecret.length < 32) {
    throw new Error(
      "BETTER_AUTH_JWT_SECRET or AUTH_JWT_SECRET must be at least 32 characters long."
    );
  }
}

const handler = toNextJsHandler(auth);

function getClientInfo(request: NextRequest): {
  ipAddress?: string;
  userAgent?: string;
} {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-client-ip") ||
      undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  };
}

/**
 * Extract session cookie from Set-Cookie headers
 */
function extractSessionCookie(setCookieHeaders: string[]): string {
  if (!setCookieHeaders || setCookieHeaders.length === 0) return "";

  for (const cookieHeader of setCookieHeaders) {
    if (cookieHeader.includes("better-auth.session_token=")) {
      const cookieValue = cookieHeader.split(";")[0].trim();
      return cookieValue;
    }
  }

  return "";
}

/**
 * Get all Set-Cookie headers from a response
 */
function getAllSetCookieHeaders(response: Response | NextResponse): string[] {
  const cookies: string[] = [];

  if (response instanceof NextResponse && response.cookies) {
    response.cookies.getAll().forEach((cookie) => {
      let cookieString = `${cookie.name}=${cookie.value}`;
      if (cookie.path) cookieString += `; Path=${cookie.path}`;
      if (cookie.domain) cookieString += `; Domain=${cookie.domain}`;
      if (cookie.expires) {
        const expiresDate =
          cookie.expires instanceof Date
            ? cookie.expires
            : new Date(cookie.expires);
        cookieString += `; Expires=${expiresDate.toUTCString()}`;
      }
      if (cookie.maxAge) cookieString += `; Max-Age=${cookie.maxAge}`;
      if (cookie.httpOnly) cookieString += `; HttpOnly`;
      if (cookie.secure) cookieString += `; Secure`;
      if (cookie.sameSite) cookieString += `; SameSite=${cookie.sameSite}`;
      cookies.push(cookieString);
    });
  } else {
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const splitCookies = setCookieHeader.split(", ");
      for (const cookie of splitCookies) {
        if (cookie.includes("=") && cookie.includes(";")) {
          cookies.push(cookie.trim());
        } else if (splitCookies.length === 1) {
          cookies.push(cookie.trim());
        }
      }
    }
  }

  return cookies;
}

export async function GET(request: NextRequest) {
  try {
    return await handler.GET(request);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Better Auth GET error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    } else {
      console.error("Better Auth GET error occurred");
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
      const rememberMe = body?.rememberMe ?? true;
      const email = body?.email;

      if (email && typeof email === "string") {
        // Check account lockout
        const lockoutStatus = await checkAccountLockout(email);
        if (lockoutStatus.isLocked) {
          const clientInfo = getClientInfo(request);
          await recordLoginAttempt(
            email,
            false,
            clientInfo.ipAddress,
            clientInfo.userAgent
          );

          // Log lockout event (only if not admin lock)
          if (!lockoutStatus.isAdminLocked) {
            await logAuthEvent("account_locked", null, false, request, {
              email,
              lockoutExpiresAt:
                lockoutStatus.lockoutExpiresAt?.toISOString(),
            });
          }

          let lockoutMessage: string;
          if (lockoutStatus.isAdminLocked) {
            lockoutMessage =
              "Your account has been locked by an administrator. Please contact support for assistance.";
          } else {
            const expiryDate = lockoutStatus.lockoutExpiresAt
              ? new Date(lockoutStatus.lockoutExpiresAt).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }
                )
              : null;

            lockoutMessage = expiryDate
              ? `Your account has been temporarily locked due to too many failed login attempts. Please try again after ${expiryDate}.`
              : "Your account has been temporarily locked due to too many failed login attempts. Please try again later.";
          }

          return NextResponse.json(
            { error: { message: lockoutMessage } },
            { status: 423 } // 423 Locked
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

      // Record login attempt and audit log based on response status
      if (email && typeof email === "string") {
        const clientInfo = getClientInfo(request);
        const success = response.status === 200 || response.status === 201;
        await recordLoginAttempt(
          email,
          success,
          clientInfo.ipAddress,
          clientInfo.userAgent
        );

        let userId: string | null = null;
        if (success) {
          try {
            const setCookieHeaders = getAllSetCookieHeaders(response);
            const sessionCookie = extractSessionCookie(setCookieHeaders);

            const cookieHeader = sessionCookie
              ? `${sessionCookie}${request.headers.get("cookie") ? `; ${request.headers.get("cookie")}` : ""}`
              : request.headers.get("cookie") || "";

            const sessionResult = await auth.api.getSession({
              headers: { cookie: cookieHeader },
            });
            userId = sessionResult?.user?.id || null;

            // IP tracking and suspicious activity detection
            if (userId && clientInfo.ipAddress) {
              const isNew = await isNewIP(userId, clientInfo.ipAddress);
              await recordLoginIP(
                userId,
                clientInfo.ipAddress,
                clientInfo.userAgent
              );

              const suspiciousCheck = await checkSuspiciousActivity(
                userId,
                clientInfo.ipAddress
              );

              if (isNew) {
                await logAuthEvent(
                  "new_ip_detected",
                  userId,
                  true,
                  request,
                  {
                    email,
                    ipAddress: clientInfo.ipAddress,
                  }
                );
              }

              if (suspiciousCheck.isSuspicious) {
                await logAuthEvent(
                  "suspicious_activity",
                  userId,
                  false,
                  request,
                  {
                    email,
                    ipAddress: clientInfo.ipAddress,
                    reasons: suspiciousCheck.reasons,
                  }
                );
              }
            }
          } catch {
            // Continue
          }
        }

        await logAuthEvent("login", userId, success, request, {
          email,
        });
      }

      // Modify the session cookie expiration based on rememberMe
      const setCookieHeaders = getAllSetCookieHeaders(response);
      if (setCookieHeaders.length > 0) {
        const modifiedCookies = setCookieHeaders.map((cookie) => {
          if (cookie.includes("better-auth.session_token")) {
            const parts = cookie.split("; ");
            const nameValue = parts[0];
            const otherParts = parts
              .slice(1)
              .filter(
                (p) =>
                  !p.trim().startsWith("Max-Age") &&
                  !p.trim().startsWith("Expires")
              );

            if (rememberMe) {
              const expiresDate = new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              );
              return [
                nameValue,
                ...otherParts,
                `Max-Age=604800`,
                `Expires=${expiresDate.toUTCString()}`,
              ].join("; ");
            } else {
              return [nameValue, ...otherParts].join("; ");
            }
          }
          return cookie;
        });

        const responseBody = await response.text();

        const newResponse = new NextResponse(responseBody, {
          status: response.status,
          statusText: response.statusText,
          headers: new Headers(),
        });

        response.headers.forEach((value, key) => {
          if (key.toLowerCase() !== "set-cookie") {
            newResponse.headers.set(key, value);
          }
        });

        modifiedCookies.forEach((cookie) => {
          newResponse.headers.append("set-cookie", cookie);
        });

        return newResponse;
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
          console.error("Failed to reconstruct request after error:", error);
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
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    } else {
      console.error("Better Auth POST error occurred");
    }
    throw error;
  }
}
