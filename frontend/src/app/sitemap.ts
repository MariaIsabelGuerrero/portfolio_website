import type { MetadataRoute } from "next";
import { getProfile, getProjects } from "@/lib/public-api";

export const revalidate = 3600;

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let base = process.env.NEXT_PUBLIC_SITE_URL || "";

  // Fall back to the profile.siteUrl from the DB if no env var is set
  if (!base) {
    try {
      const { data } = await getProfile();
      base = data.siteUrl || "";
    } catch {
      // ignore — return empty sitemap below if base is still unset
    }
  }

  if (!base) return [];
  base = normalizeBaseUrl(base);

  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];

  try {
    const { data: projects } = await getProjects();
    for (const project of projects) {
      entries.push({
        url: `${base}/project/${project.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // If the API is unreachable at build time, still return the root URL.
  }

  return entries;
}
