import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    const result = await db.select().from(projects);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { title, description, img, technologies, github, live, keyFeatures } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const [created] = await db.insert(projects).values({
      id,
      title,
      description,
      img: img || "",
      technologies: technologies || [],
      github: github || "",
      live: live || "",
      keyFeatures: keyFeatures || [],
    }).returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
