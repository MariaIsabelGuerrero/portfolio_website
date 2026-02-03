import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { contact } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [result] = await db.select().from(contact).where(eq(contact.id, "default"));

    if (!result) {
      return NextResponse.json({ data: { email: "", phone: "", location: "", github: "", linkedin: "", twitter: "" } });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Failed to fetch contact:", error);
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { email, phone, location, github, linkedin, twitter } = body;

    const [updated] = await db
      .update(contact)
      .set({
        email: email ?? "",
        phone: phone ?? "",
        location: location ?? "",
        github: github ?? "",
        linkedin: linkedin ?? "",
        twitter: twitter ?? "",
        updatedAt: new Date(),
      })
      .where(eq(contact.id, "default"))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Contact record not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Failed to update contact:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}
