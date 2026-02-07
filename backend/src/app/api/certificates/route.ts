import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { certificates } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { desc } from "drizzle-orm";
import { validateNotEmpty, validateURL, sanitizeText } from "@/lib/utils/validation";

// GET - List all certificates (public)
export async function GET() {
  try {
    const result = await db
      .select()
      .from(certificates)
      .orderBy(desc(certificates.createdAt));
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST - Create certificate record (after file upload)
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { title, fileUrl, fileType } = body;

    if (!validateNotEmpty(title)) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!validateURL(fileUrl)) {
      return NextResponse.json(
        { error: "Valid file URL is required" },
        { status: 400 }
      );
    }

    const sanitizedTitle = sanitizeText(title);
    const certFileType = fileType === "pdf" ? "pdf" : "image";

    const [created] = await db
      .insert(certificates)
      .values({
        id: crypto.randomUUID(),
        title: sanitizedTitle,
        fileUrl,
        fileType: certFileType,
      })
      .returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}
