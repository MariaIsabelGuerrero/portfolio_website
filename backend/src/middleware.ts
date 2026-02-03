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

  // HSTS header (only for HTTPS in production)
  if (process.env.NODE_ENV === "production" && request.url.startsWith("https://")) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // Handle CORS for API endpoints
  if (request.nextUrl.pathname.startsWith("/api")) {
    const origin = request.headers.get("origin");
    const allowedOrigins = getAllowedOrigins();

    const allowedOrigin = origin && allowedOrigins.includes(origin)
      ? origin
      : (allowedOrigins.length > 0 ? allowedOrigins[0] : null);

    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    // Rate limiting for contact form submissions (via messages endpoint)
    if (request.nextUrl.pathname.includes("/api/messages") && request.method === "POST") {
      const identifier = getRateLimitIdentifier(request);

      // 5 submissions per 15 minutes
      const isAllowed = checkRateLimit(`${identifier}:contact`, 5, 15 * 60 * 1000);

      if (!isAllowed) {
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

    // Rate limiting for testimonial submissions
    if (request.nextUrl.pathname.includes("/api/testimonials") && request.method === "POST") {
      const identifier = getRateLimitIdentifier(request);

      // 3 submissions per hour
      const isAllowed = checkRateLimit(`${identifier}:testimonial`, 3, 60 * 60 * 1000);

      if (!isAllowed) {
        response.headers.set("Retry-After", "3600");
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
    "/api/:path*",
  ],
};
