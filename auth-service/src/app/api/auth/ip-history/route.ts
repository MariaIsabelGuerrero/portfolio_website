import { auth } from "@/lib/auth/auth";
import { getUserIPHistory } from "@/lib/security/ip-security";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET: List login IP history for the current user
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

    const history = await getUserIPHistory(sessionResult.user.id);

    return NextResponse.json({ history });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching IP history:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch IP history" },
      { status: 500 }
    );
  }
}
