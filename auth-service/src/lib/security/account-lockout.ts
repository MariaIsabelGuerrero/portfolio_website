import { db } from "../auth/auth";
import * as schema from "../db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export interface LockoutStatus {
  isLocked: boolean;
  lockoutExpiresAt?: Date;
  failedAttempts: number;
}

export async function checkAccountLockout(email: string): Promise<LockoutStatus> {
  const lockoutWindowStart = new Date(Date.now() - LOCKOUT_DURATION_MINUTES * 60 * 1000);

  const recentAttempts = await db
    .select()
    .from(schema.loginAttempt)
    .where(
      and(
        eq(schema.loginAttempt.email, email.toLowerCase()),
        gte(schema.loginAttempt.attemptedAt, lockoutWindowStart)
      )
    )
    .orderBy(desc(schema.loginAttempt.attemptedAt));

  const failedAttempts = recentAttempts.filter(a => !a.success).length;
  const lastSuccessfulLogin = recentAttempts.find(a => a.success);

  // If there's a successful login after failures, reset count
  const failedSinceLastSuccess = lastSuccessfulLogin
    ? recentAttempts.filter(a => !a.success && a.attemptedAt > lastSuccessfulLogin.attemptedAt).length
    : failedAttempts;

  if (failedSinceLastSuccess >= MAX_FAILED_ATTEMPTS) {
    const oldestFailedAttempt = recentAttempts
      .filter(a => !a.success)
      .slice(-MAX_FAILED_ATTEMPTS)[0];

    if (oldestFailedAttempt) {
      const lockoutExpiresAt = new Date(
        oldestFailedAttempt.attemptedAt.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000
      );

      if (lockoutExpiresAt > new Date()) {
        return {
          isLocked: true,
          lockoutExpiresAt,
          failedAttempts: failedSinceLastSuccess,
        };
      }
    }
  }

  return {
    isLocked: false,
    failedAttempts: failedSinceLastSuccess,
  };
}

export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await db.insert(schema.loginAttempt).values({
    id: randomUUID(),
    email: email.toLowerCase(),
    success,
    ipAddress,
    userAgent,
    attemptedAt: new Date(),
  });
}
