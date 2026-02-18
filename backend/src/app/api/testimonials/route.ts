import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all");
    const status = request.nextUrl.searchParams.get("status");

    // If requesting all or filtering by status, require admin
    if (all === "true" || status) {
      const auth = requireAdmin(request);
      if (auth.error) return auth.error;

      let result;
      if (status) {
        result = await db.select().from(testimonials).where(eq(testimonials.status, status)).orderBy(desc(testimonials.date));
      } else {
        result = await db.select().from(testimonials).orderBy(desc(testimonials.date));
      }

      return NextResponse.json({ data: result, count: result.length });
    }

    // Public: only return approved testimonials
    const result = await db.select().from(testimonials).where(eq(testimonials.status, "approved")).orderBy(desc(testimonials.date));
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Public endpoint - visitors submit testimonials (no auth required)
  try {
    const body = await request.json();
    const { name, relationship, content } = body;

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const [created] = await db.insert(testimonials).values({
      id,
      name,
      relationship: relationship || "",
      content,
      status: "pending",
    }).returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json({ error: "Failed to submit testimonial" }, { status: 500 });
  }
}
