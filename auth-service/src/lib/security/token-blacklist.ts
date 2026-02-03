/**
 * Token blacklist functionality
 * Allows revocation of JWT tokens before they expire
 */

import { db } from "../auth/auth";
import { tokenBlacklist } from "../db/schema";
import { eq, and, gte } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";

/**
 * Hash a JWT token for storage in blacklist
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Check if a token is blacklisted
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const tokenHash = hashToken(token);

  const blacklisted = await db
    .select()
    .from(tokenBlacklist)
    .where(
      and(
        eq(tokenBlacklist.tokenHash, tokenHash),
        gte(tokenBlacklist.expiresAt, new Date()) // Only check if token hasn't expired
      )
    )
    .limit(1);

  return blacklisted.length > 0;
}

/**
 * Add a token to the blacklist
 */
export async function blacklistToken(
  token: string,
  userId: string,
  expiresAt: Date,
  reason?: string
): Promise<void> {
  const tokenHash = hashToken(token);
  const id = randomBytes(16).toString("hex");

  await db.insert(tokenBlacklist).values({
    id,
    tokenHash,
    userId,
    expiresAt,
    revokedAt: new Date(),
    reason: reason || null,
  });
}

/**
 * Remove expired tokens from blacklist (cleanup)
 * Should be called by a scheduled job
 */
export async function cleanupExpiredTokens(): Promise<number> {
  // In production, use a cron job to delete expired records:
  // DELETE FROM token_blacklist WHERE "expiresAt" < NOW();
  return 0;
}
