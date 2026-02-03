import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { skills, projects, experiences, education, hobbies, messages, testimonials } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const [
      [skillCount],
      [projectCount],
      [experienceCount],
      [educationCount],
      [hobbyCount],
      [unreadMessageCount],
      [pendingTestimonialCount],
    ] = await Promise.all([
      db.select({ count: count() }).from(skills),
      db.select({ count: count() }).from(projects),
      db.select({ count: count() }).from(experiences),
      db.select({ count: count() }).from(education),
      db.select({ count: count() }).from(hobbies),
      db.select({ count: count() }).from(messages).where(eq(messages.read, false)),
      db.select({ count: count() }).from(testimonials).where(eq(testimonials.status, "pending")),
    ]);

    return NextResponse.json({
      data: {
        skills: skillCount.count,
        projects: projectCount.count,
        experience: experienceCount.count,
        education: educationCount.count,
        hobbies: hobbyCount.count,
        unreadMessages: unreadMessageCount.count,
        pendingTestimonials: pendingTestimonialCount.count,
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
