import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { eq, desc } from "drizzle-orm";
import { validateNotEmpty, validateURL, sanitizeText } from "@/lib/utils/validation";

// GET - List resumes (admin: all, public: active only)
export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all");

    if (all === "true") {
      const auth = requireAdmin(request);
      if (auth.error) return auth.error;

      const result = await db
        .select()
        .from(resumes)
        .orderBy(desc(resumes.createdAt));
      return NextResponse.json({ data: result });
    }

    // Public: return only active resumes
    const result = await db
      .select()
      .from(resumes)
      .where(eq(resumes.isActive, true))
      .orderBy(desc(resumes.createdAt));
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

// POST - Create resume record (after file upload)
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { filename, fileUrl, isActive, language } = body;

    if (!validateNotEmpty(filename)) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    if (!validateURL(fileUrl)) {
      return NextResponse.json(
        { error: "Valid file URL is required" },
        { status: 400 }
      );
    }

    const resumeLanguage = language === "fr" ? "fr" : "en";
    const sanitizedFilename = sanitizeText(filename);

    // If setting this as active, deactivate all others with the same language
    if (isActive) {
      await db
        .update(resumes)
        .set({ isActive: false })
        .where(eq(resumes.language, resumeLanguage));
    }

    const [created] = await db
      .insert(resumes)
      .values({
        id: crypto.randomUUID(),
        filename: sanitizedFilename,
        fileUrl,
        isActive: isActive || false,
        language: resumeLanguage,
      })
      .returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}

// PUT - Update active resume (or create if none exists)
export async function PUT(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { filename, fileUrl } = body;

    if (!validateNotEmpty(filename)) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    if (!validateURL(fileUrl)) {
      return NextResponse.json(
        { error: "Valid file URL is required" },
        { status: 400 }
      );
    }

    const sanitizedFilename = sanitizeText(filename);

    // Check if there's an active resume
    const [activeResume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.isActive, true))
      .limit(1);

    // Deactivate all existing resumes first
    await db.update(resumes).set({ isActive: false });

    // If there was an active resume, update it; otherwise create new
    if (activeResume) {
      const [updatedResume] = await db
        .update(resumes)
        .set({
          filename: sanitizedFilename,
          fileUrl,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(resumes.id, activeResume.id))
        .returning();
      return NextResponse.json({ data: updatedResume });
    } else {
      const [newResume] = await db
        .insert(resumes)
        .values({
          id: crypto.randomUUID(),
          filename: sanitizedFilename,
          fileUrl,
          isActive: true,
        })
        .returning();
      return NextResponse.json({ data: newResume }, { status: 201 });
    }
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}
