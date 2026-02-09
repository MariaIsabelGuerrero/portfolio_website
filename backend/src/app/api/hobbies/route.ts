import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hobbies } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await db.select().from(hobbies);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Failed to fetch hobbies:", error);
    return NextResponse.json({ error: "Failed to fetch hobbies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name_en, name_fr, description_en, description_fr, icon, color } = body;

    if (!name_en) {
      return NextResponse.json({ error: "English name is required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const [created] = await db.insert(hobbies).values({
      id,
      name_en,
      name_fr: name_fr || "",
      description_en: description_en || "",
      description_fr: description_fr || "",
      icon: icon || "",
      color: color || "",
    }).returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create hobby:", error);
    return NextResponse.json({ error: "Failed to create hobby" }, { status: 500 });
  }
}
