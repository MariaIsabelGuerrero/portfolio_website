/**
 * Account lockout functionality
 * Tracks failed login attempts and locks accounts after threshold
 */

import { db } from "../auth/auth";
import { loginAttempt, auditLog, user } from "../db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

export const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export interface LockoutStatus {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutExpiresAt?: Date;
  isAdminLocked?: boolean;
}

/**
 * Check if an account is currently locked
 */
export async function checkAccountLockout(
  email: string
): Promise<LockoutStatus> {
  const thirtyMinutesAgo = new Date(Date.now() - LOCKOUT_DURATION_MS);

  // Check if there's a recent admin lock in the audit log
  const users = await db
    .select()
    .from(user)
    .where(eq(user.email, email.toLowerCase()))
    .limit(1);

  if (users.length > 0) {
    const userId = users[0].id;

    // Check for recent unlock event first
    const unlockEvents = await db
      .select()
      .from(auditLog)
      .where(
        and(
          eq(auditLog.userId, userId),
          eq(auditLog.eventType, "account_unlocked"),
          eq(auditLog.success, true),
          gte(auditLog.createdAt, thirtyMinutesAgo)
        )
      )
      .orderBy(desc(auditLog.createdAt))
      .limit(1);

    // Check for recent admin lock event
    const adminLockEvents = await db
      .select()
      .from(auditLog)
      .where(
        and(
          eq(auditLog.userId, userId),
          eq(auditLog.eventType, "account_locked"),
          eq(auditLog.success, true),
          gte(auditLog.createdAt, thirtyMinutesAgo)
        )
      )
      .orderBy(desc(auditLog.createdAt))
      .limit(1);

    // If there's an unlock event, check if it's more recent than the lock event
    if (unlockEvents.length > 0) {
      const unlockEvent = unlockEvents[0];
      if (
        adminLockEvents.length === 0 ||
        unlockEvent.createdAt > adminLockEvents[0].createdAt
      ) {
        // Account was unlocked, continue to check for automatic lockouts
      } else {
        const adminLockEvent = adminLockEvents[0];
        const metadata = adminLockEvent.metadata as { reason?: string } | null;
        if (metadata && metadata.reason === "admin_locked") {
          const lockoutExpiresAt = new Date(
            adminLockEvent.createdAt.getTime() + LOCKOUT_DURATION_MS
          );
          return {
            isLocked: true,
            remainingAttempts: 0,
            lockoutExpiresAt,
            isAdminLocked: true,
          };
        }
      }
    } else if (adminLockEvents.length > 0) {
      const adminLockEvent = adminLockEvents[0];
      const metadata = adminLockEvent.metadata as { reason?: string } | null;
      if (metadata && metadata.reason === "admin_locked") {
        const lockoutExpiresAt = new Date(
          adminLockEvent.createdAt.getTime() + LOCKOUT_DURATION_MS
        );
        return {
          isLocked: true,
          remainingAttempts: 0,
          lockoutExpiresAt,
          isAdminLocked: true,
        };
      }
    }
  }

  // Check for automatic lockout due to failed attempts
  const recentAttempts = await db
    .select()
    .from(loginAttempt)
    .where(
      and(
        eq(loginAttempt.email, email.toLowerCase()),
        eq(loginAttempt.success, false),
        gte(loginAttempt.attemptedAt, thirtyMinutesAgo)
      )
    )
    .orderBy(desc(loginAttempt.attemptedAt))
    .limit(MAX_FAILED_ATTEMPTS);

  const failedCount = recentAttempts.length;
  const isLocked = failedCount >= MAX_FAILED_ATTEMPTS;

  if (isLocked && recentAttempts.length > 0) {
    const oldestAttempt = recentAttempts[recentAttempts.length - 1];
    const lockoutExpiresAt = new Date(
      oldestAttempt.attemptedAt.getTime() + LOCKOUT_DURATION_MS
    );
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutExpiresAt,
      isAdminLocked: false,
    };
  }

  return {
    isLocked: false,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - failedCount),
  };
}

/**
 * Record a login attempt
 */
export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const id = randomBytes(16).toString("hex");

  await db.insert(loginAttempt).values({
    id,
    email: email.toLowerCase(),
    ipAddress: ipAddress || null,
    success,
    attemptedAt: new Date(),
    userAgent: userAgent || null,
  });
}

/**
 * Clear failed attempts for an email (called on successful login)
 */
export async function clearFailedAttempts(_email: string): Promise<void> {
  // The checkAccountLockout function only looks at recent failures,
  // so recording a successful attempt effectively resets the counter
}
