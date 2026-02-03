import { auth } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import { revokeSession } from "@/lib/security/session-management";
import { logAuthEvent } from "@/lib/security/audit-log";

/**
 * DELETE: Revoke a specific session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const cookieHeader = request.headers.get("cookie") || "";
    const sessionResult = await auth.api.getSession({
      headers: { cookie: cookieHeader },
    });

    if (!sessionResult || !sessionResult.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Prevent revoking current session
    if (sessionResult.session?.id === sessionId) {
      return NextResponse.json(
        { error: "Cannot revoke current session. Use logout instead." },
        { status: 400 }
      );
    }

    const revoked = await revokeSession(sessionId, sessionResult.user.id);

    if (!revoked) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    await logAuthEvent("session_revoked", sessionResult.user.id, true, request, {
      sessionId,
      reason: "user_revoked",
    });

    return NextResponse.json({
      message: "Session revoked successfully",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error revoking session:", error);
    }
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 }
    );
  }
}
