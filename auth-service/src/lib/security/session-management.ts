/**
 * Session management functionality
 * Allows admin to view and revoke active sessions
 */

import { db } from "../auth/auth";
import { session } from "../db/schema";
import { eq, and, gte } from "drizzle-orm";

export interface SessionInfo {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
  isCurrent: boolean;
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(
  userId: string,
  currentSessionId?: string
): Promise<SessionInfo[]> {
  const now = new Date();

  const sessions = await db
    .select()
    .from(session)
    .where(
      and(
        eq(session.userId, userId),
        gte(session.expiresAt, now) // Only active sessions
      )
    )
    .orderBy(session.createdAt);

  return sessions.map((s) => ({
    id: s.id,
    ipAddress: s.ipAddress,
    userAgent: s.userAgent,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
    isCurrent: currentSessionId ? s.id === currentSessionId : false,
  }));
}

/**
 * Get session information by ID
 */
export async function getSessionInfo(
  sessionId: string
): Promise<SessionInfo | null> {
  const sessions = await db
    .select()
    .from(session)
    .where(eq(session.id, sessionId))
    .limit(1);

  if (sessions.length === 0) {
    return null;
  }

  const s = sessions[0];
  return {
    id: s.id,
    ipAddress: s.ipAddress,
    userAgent: s.userAgent,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
    isCurrent: false,
  };
}

/**
 * Revoke a specific session
 */
export async function revokeSession(
  sessionId: string,
  userId: string
): Promise<boolean> {
  try {
    const sessions = await db
      .select()
      .from(session)
      .where(and(eq(session.id, sessionId), eq(session.userId, userId)))
      .limit(1);

    if (sessions.length === 0) {
      return false;
    }

    await db.delete(session).where(eq(session.id, sessionId));
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error revoking session:", error);
    }
    return false;
  }
}

/**
 * Revoke all sessions except the current one
 */
export async function revokeAllSessionsExcept(
  userId: string,
  currentSessionId: string
): Promise<number> {
  try {
    const allSessions = await db
      .select()
      .from(session)
      .where(eq(session.userId, userId));

    let revokedCount = 0;
    for (const s of allSessions) {
      if (s.id !== currentSessionId) {
        await db.delete(session).where(eq(session.id, s.id));
        revokedCount++;
      }
    }

    return revokedCount;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error revoking sessions:", error);
    }
    return 0;
  }
}
