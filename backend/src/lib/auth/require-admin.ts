import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, type JWTPayload } from "./verify-token";

type AuthResult =
  | { user: JWTPayload; error?: never }
  | { user?: never; error: NextResponse };

export function requireAdmin(request: NextRequest): AuthResult {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.substring(7);

  try {
    const user = verifyToken(token);

    if (user.role !== "ADMIN") {
      return {
        error: NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        ),
      };
    }

    return { user };
  } catch {
    return {
      error: NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      ),
    };
  }
}
