import { auth } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getUserSessions,
  revokeAllSessionsExcept,
} from "@/lib/security/session-management";
import { logAuthEvent } from "@/lib/security/audit-log";

/**
 * GET: List all active sessions for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionResult = await auth.api.getSession({
      headers: { cookie: cookieHeader },
    });

    if (!sessionResult || !sessionResult.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessions = await getUserSessions(
      sessionResult.user.id,
      sessionResult.session?.id
    );

    return NextResponse.json({ sessions });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching sessions:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Revoke all sessions except the current one
 */
export async function DELETE(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionResult = await auth.api.getSession({
      headers: { cookie: cookieHeader },
    });

    if (!sessionResult || !sessionResult.user || !sessionResult.session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const revokedCount = await revokeAllSessionsExcept(
      sessionResult.user.id,
      sessionResult.session.id
    );

    await logAuthEvent("session_revoked", sessionResult.user.id, true, request, {
      reason: "revoke_all",
      revokedCount: revokedCount.toString(),
    });

    return NextResponse.json({
      message: `Revoked ${revokedCount} session(s)`,
      revokedCount,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error revoking sessions:", error);
    }
    return NextResponse.json(
      { error: "Failed to revoke sessions" },
      { status: 500 }
    );
  }
}
