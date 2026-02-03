import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { education } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await db.select().from(education).orderBy(desc(education.createdAt));
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Failed to fetch education:", error);
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { degree, institution, location, period, description, achievements } = body;

    if (!degree || !institution || !period) {
      return NextResponse.json({ error: "Degree, institution, and period are required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const [created] = await db.insert(education).values({
      id,
      degree,
      institution,
      location: location || "",
      period,
      description: description || "",
      achievements: achievements || [],
    }).returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create education:", error);
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}
