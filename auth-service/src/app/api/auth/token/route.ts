import { auth } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.BETTER_AUTH_JWT_SECRET ||
                      process.env.AUTH_JWT_SECRET ||
                      process.env.BETTER_AUTH_SECRET;

    if (!jwtSecret) {
      console.error("JWT secret not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create JWT token for API authentication
    const token = jwt.sign(
      {
        sub: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as { role?: string }).role || "USER",
        locale: (session.user as { locale?: string }).locale || "en",
      },
      jwtSecret,
      {
        expiresIn: "1h",
        issuer: "portfolio-auth",
        audience: "portfolio-api",
      }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
