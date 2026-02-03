import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { eq } from "drizzle-orm";
import { validateUUID, validateNotEmpty, validateURL, sanitizeText } from "@/lib/utils/validation";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;

    if (!validateUUID(id)) {
      return NextResponse.json({ error: "Invalid resume ID" }, { status: 400 });
    }

    const body = await request.json();
    const { filename, fileUrl, isActive, language } = body;

    const [existingResume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (!existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const updateData: {
      filename?: string;
      fileUrl?: string;
      isActive?: boolean;
      language?: string;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (filename !== undefined) {
      if (!validateNotEmpty(filename)) {
        return NextResponse.json(
          { error: "Filename is required" },
          { status: 400 }
        );
      }
      updateData.filename = sanitizeText(filename);
    }

    if (fileUrl !== undefined) {
      if (!validateURL(fileUrl)) {
        return NextResponse.json(
          { error: "Valid file URL is required" },
          { status: 400 }
        );
      }
      updateData.fileUrl = fileUrl;
    }

    if (language !== undefined) {
      updateData.language = language === "fr" ? "fr" : "en";
    }

    const targetLanguage = updateData.language || existingResume.language;

    if (isActive !== undefined) {
      updateData.isActive = isActive;

      if (isActive) {
        await db
          .update(resumes)
          .set({ isActive: false })
          .where(eq(resumes.language, targetLanguage!));
      }
    }

    const [updatedResume] = await db
      .update(resumes)
      .set(updateData)
      .where(eq(resumes.id, id))
      .returning();

    return NextResponse.json({ data: updatedResume });
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json(
      { error: "Failed to update resume" },
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
      return NextResponse.json({ error: "Invalid resume ID" }, { status: 400 });
    }

    const [existingResume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (!existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    await db.delete(resumes).where(eq(resumes.id, id));

    return NextResponse.json({ success: true, message: "Resume deleted" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
