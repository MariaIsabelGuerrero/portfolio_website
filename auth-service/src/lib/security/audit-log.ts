/**
 * Audit logging functionality
 * Logs all authentication events for security and compliance
 */

import { db } from "../auth/auth";
import { auditLog } from "../db/schema";
import { randomBytes } from "crypto";
import type { NextRequest } from "next/server";

export type AuditEventType =
  | "login"
  | "logout"
  | "signup"
  | "password_change"
  | "account_locked"
  | "account_unlocked"
  | "token_revoked"
  | "session_created"
  | "session_revoked"
  | "new_ip_detected"
  | "suspicious_activity";

export interface AuditLogMetadata {
  [key: string]: any;
  email?: string;
  reason?: string;
  sessionId?: string;
  lockoutExpiresAt?: string;
  tokenId?: string;
}

/**
 * Extract client information from request
 */
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
 * Log an authentication event
 */
export async function logAuthEvent(
  eventType: AuditEventType,
  userId: string | null,
  success: boolean,
  request: NextRequest,
  metadata?: AuditLogMetadata
): Promise<void> {
  try {
    const clientInfo = getClientInfo(request);
    const id = randomBytes(16).toString("hex");

    await db.insert(auditLog).values({
      id,
      userId: userId || null,
      eventType,
      success,
      ipAddress: clientInfo.ipAddress || null,
      userAgent: clientInfo.userAgent || null,
      metadata: metadata ? (metadata as any) : null,
      createdAt: new Date(),
    });
  } catch (error) {
    // Don't throw - audit logging should not break the application
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to log audit event:", error);
    }
  }
}

/**
 * Log an authentication event without a request object
 * Useful for background processes or when request is not available
 */
export async function logAuthEventDirect(
  eventType: AuditEventType,
  userId: string | null,
  success: boolean,
  ipAddress?: string,
  userAgent?: string,
  metadata?: AuditLogMetadata
): Promise<void> {
  try {
    const id = randomBytes(16).toString("hex");

    await db.insert(auditLog).values({
      id,
      userId: userId || null,
      eventType,
      success,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      metadata: metadata ? (metadata as any) : null,
      createdAt: new Date(),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to log audit event:", error);
    }
  }
}

/**
 * Clean up old audit logs (retain 90 days by default)
 * Should be called by a scheduled job
 */
export async function cleanupOldAuditLogs(
  retentionDays: number = 90
): Promise<number> {
  // In production, use a database cron job:
  // DELETE FROM audit_log WHERE "createdAt" < NOW() - INTERVAL '90 days';
  return 0;
}
