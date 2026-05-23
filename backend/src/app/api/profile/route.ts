import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

const PROFILE_ID = "default";

const emptyProfile = {
  id: PROFILE_ID,
  fullName: "",
  shortName: "",
  siteUrl: "",
  profileImage: "",
  heroBadge_en: "",
  heroBadge_fr: "",
  heroTitleLine1_en: "",
  heroTitleLine1_fr: "",
  heroTitleLine2_en: "",
  heroTitleLine2_fr: "",
  heroDescription_en: "",
  heroDescription_fr: "",
  typingWords_en: [] as string[],
  typingWords_fr: [] as string[],
  techStack: [] as string[],
  bio_en: "",
  bio_fr: "",
  quote_en: "",
  quote_fr: "",
  experienceSince: null as Date | null,
  metaTitle: "",
  metaDescription: "",
};

export async function GET() {
  try {
    const [result] = await db
      .select()
      .from(profile)
      .where(eq(profile.id, PROFILE_ID));

    if (!result) {
      return NextResponse.json({ data: emptyProfile });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();

    const toStringArray = (v: unknown): string[] => {
      if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
      return [];
    };

    const values = {
      fullName: String(body.fullName ?? ""),
      shortName: String(body.shortName ?? ""),
      siteUrl: String(body.siteUrl ?? ""),
      profileImage: String(body.profileImage ?? ""),
      heroBadge_en: String(body.heroBadge_en ?? ""),
      heroBadge_fr: String(body.heroBadge_fr ?? ""),
      heroTitleLine1_en: String(body.heroTitleLine1_en ?? ""),
      heroTitleLine1_fr: String(body.heroTitleLine1_fr ?? ""),
      heroTitleLine2_en: String(body.heroTitleLine2_en ?? ""),
      heroTitleLine2_fr: String(body.heroTitleLine2_fr ?? ""),
      heroDescription_en: String(body.heroDescription_en ?? ""),
      heroDescription_fr: String(body.heroDescription_fr ?? ""),
      typingWords_en: toStringArray(body.typingWords_en),
      typingWords_fr: toStringArray(body.typingWords_fr),
      techStack: toStringArray(body.techStack),
      bio_en: String(body.bio_en ?? ""),
      bio_fr: String(body.bio_fr ?? ""),
      quote_en: String(body.quote_en ?? ""),
      quote_fr: String(body.quote_fr ?? ""),
      experienceSince: body.experienceSince ? new Date(body.experienceSince) : null,
      metaTitle: String(body.metaTitle ?? ""),
      metaDescription: String(body.metaDescription ?? ""),
      updatedAt: new Date(),
    };

    // Upsert: try update first, fall back to insert if row doesn't exist
    const [updated] = await db
      .update(profile)
      .set(values)
      .where(eq(profile.id, PROFILE_ID))
      .returning();

    if (updated) {
      return NextResponse.json({ data: updated });
    }

    const [created] = await db
      .insert(profile)
      .values({ id: PROFILE_ID, ...values })
      .returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
