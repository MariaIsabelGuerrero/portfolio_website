import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { experiences } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await db.select().from(experiences).orderBy(desc(experiences.createdAt));
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Failed to fetch experience:", error);
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { title_en, title_fr, company, location, period, type, description_en, description_fr, responsibilities_en, responsibilities_fr } = body;

    if (!title_en || !company || !period) {
      return NextResponse.json({ error: "English title, company, and period are required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const [created] = await db.insert(experiences).values({
      id,
      title_en,
      title_fr: title_fr || "",
      company,
      location: location || "",
      period,
      type: type || "",
      description_en: description_en || "",
      description_fr: description_fr || "",
      responsibilities_en: responsibilities_en || [],
      responsibilities_fr: responsibilities_fr || [],
    }).returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create experience:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
