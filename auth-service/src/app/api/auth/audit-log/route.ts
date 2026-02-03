import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/auth/auth";
import { auditLog } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET: List recent audit logs for the current user
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

    const url = new URL(request.url);
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "20", 10),
      100
    );

    const logs = await db
      .select()
      .from(auditLog)
      .where(eq(auditLog.userId, sessionResult.user.id))
      .orderBy(desc(auditLog.createdAt))
      .limit(limit);

    return NextResponse.json({ logs });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching audit logs:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
