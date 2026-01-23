import { db } from "../auth/auth";
import * as schema from "../db/schema";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export type AuthEventType =
  | "login"
  | "logout"
  | "signup"
  | "password_change"
  | "account_locked"
  | "token_revoked"
  | "session_created"
  | "session_revoked";

export async function logAuthEvent(
  eventType: AuthEventType,
  userId: string | null,
  success: boolean,
  request: NextRequest,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      undefined;

    const userAgent = request.headers.get("user-agent") || undefined;

    await db.insert(schema.auditLog).values({
      id: randomUUID(),
      userId,
      eventType,
      success,
      ipAddress,
      userAgent,
      metadata: metadata || null,
      createdAt: new Date(),
    });
  } catch (error) {
    // Log error but don't throw - audit logging should not break auth flow
    console.error("Failed to log auth event:", error);
  }
}
