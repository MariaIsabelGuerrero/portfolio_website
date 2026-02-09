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
    const { degree_en, degree_fr, institution, location, period, description_en, description_fr } = body;

    if (!degree_en || !institution || !period) {
      return NextResponse.json({ error: "English degree, institution, and period are required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const [created] = await db.insert(education).values({
      id,
      degree_en,
      degree_fr: degree_fr || "",
      institution,
      location: location || "",
      period,
      description_en: description_en || "",
      description_fr: description_fr || "",
    }).returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create education:", error);
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}
