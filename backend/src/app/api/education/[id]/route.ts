import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { education } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(education)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(education.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Failed to update education:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const [deleted] = await db.delete(education).where(eq(education.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    console.error("Failed to delete education:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
