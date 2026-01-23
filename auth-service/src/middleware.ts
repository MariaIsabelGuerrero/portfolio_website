import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Parse CORS origins from environment variable
const getAllowedOrigins = (): string[] => {
  const corsOrigins = process.env.CORS_ORIGINS;
  if (corsOrigins) {
    return corsOrigins.split(",").map(origin => origin.trim()).filter(Boolean);
  }
  // Fallback for development only
  if (process.env.NODE_ENV === "development") {
    return ["http://localhost:3000"];
  }
  return [];
};

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

function getRateLimitIdentifier(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             request.headers.get("x-real-ip") ||
             request.headers.get("cf-connecting-ip") ||
             request.headers.get("x-client-ip") ||
             "unknown";
  return `rate-limit:${ip}`;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS header (only for HTTPS)
  if (process.env.NODE_ENV === "production" && request.url.startsWith("https://")) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // Handle CORS for auth endpoints
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    const origin = request.headers.get("origin");
    const allowedOrigins = getAllowedOrigins();

    const allowedOrigin = origin && allowedOrigins.includes(origin)
      ? origin
      : (allowedOrigins.length > 0 ? allowedOrigins[0] : null);

    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    // Rate limiting for authentication endpoints
    const isAuthEndpoint = request.nextUrl.pathname.includes("/sign-in") ||
                          request.nextUrl.pathname.includes("/sign-up");

    if (isAuthEndpoint && request.method === "POST") {
      const identifier = getRateLimitIdentifier(request);

      // 5 attempts per 15 minutes
      const shortWindow = checkRateLimit(`${identifier}:short`, 5, 15 * 60 * 1000);
      // 20 attempts per hour
      const longWindow = checkRateLimit(`${identifier}:long`, 20, 60 * 60 * 1000);

      if (!shortWindow || !longWindow) {
        response.headers.set("Retry-After", "900");
        return NextResponse.json(
          {
            error: "Too many requests",
            message: "Rate limit exceeded. Please try again later."
          },
          {
            status: 429,
            headers: response.headers
          }
        );
      }
    }

    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/api/auth/token",
  ],
};
