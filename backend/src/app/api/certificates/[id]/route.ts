import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { certificates } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { eq } from "drizzle-orm";
import { validateUUID, validateNotEmpty, sanitizeText } from "@/lib/utils/validation";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;

    if (!validateUUID(id)) {
      return NextResponse.json({ error: "Invalid certificate ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title } = body;

    const [existing] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const updateData: { title?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      if (!validateNotEmpty(title)) {
        return NextResponse.json(
          { error: "Title is required" },
          { status: 400 }
        );
      }
      updateData.title = sanitizeText(title);
    }

    const [updated] = await db
      .update(certificates)
      .set(updateData)
      .where(eq(certificates.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json(
      { error: "Failed to update certificate" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;

    if (!validateUUID(id)) {
      return NextResponse.json({ error: "Invalid certificate ID" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    await db.delete(certificates).where(eq(certificates.id, id));

    return NextResponse.json({ success: true, message: "Certificate deleted" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
