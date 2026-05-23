const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

async function publicFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ---- Public Data Fetching ----

export async function getSkills() {
  return publicFetch<{ data: SkillData[] }>("/api/skills");
}

export async function getProjects() {
  return publicFetch<{ data: ProjectData[] }>("/api/projects");
}

export async function getExperience() {
  return publicFetch<{ data: ExperienceData[] }>("/api/experience");
}

export async function getEducation() {
  return publicFetch<{ data: EducationData[] }>("/api/education");
}

export async function getHobbies() {
  return publicFetch<{ data: HobbyData[] }>("/api/hobbies");
}

export async function getContact() {
  return publicFetch<{ data: ContactData }>("/api/contact");
}

export async function getProfile() {
  return publicFetch<{ data: ProfileData }>("/api/profile");
}

export async function getTestimonials() {
  return publicFetch<{ data: TestimonialData[] }>("/api/testimonials");
}

export async function submitTestimonial(data: { name: string; relationship: string; content: string }) {
  return publicFetch<{ data: TestimonialData }>("/api/testimonials", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitMessage(data: {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  website?: string;
}) {
  return publicFetch<{ data: MessageData }>("/api/messages", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---- Types ----

export interface SkillData {
  id: string;
  name: string;
  icon: string;
}

export interface ProjectData {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  img: string;
  technologies: string[];
  github: string;
  live: string;
  keyFeatures_en: string[];
  keyFeatures_fr: string[];
}

export interface ExperienceData {
  id: string;
  title_en: string;
  title_fr: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description_en: string;
  description_fr: string;
  responsibilities_en: string[];
  responsibilities_fr: string[];
}

export interface EducationData {
  id: string;
  degree_en: string;
  degree_fr: string;
  institution: string;
  location: string;
  period: string;
  description_en: string;
  description_fr: string;
}

export interface HobbyData {
  id: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  icon: string;
  color: string;
}

export interface TestimonialData {
  id: string;
  name: string;
  relationship: string;
  content: string;
  date: string;
  status: string;
}

export interface MessageData {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
}

export interface ProfileData {
  id: string;
  fullName: string;
  shortName: string;
  siteUrl: string;
  profileImage: string;
  heroBadge_en: string;
  heroBadge_fr: string;
  heroTitleLine1_en: string;
  heroTitleLine1_fr: string;
  heroTitleLine2_en: string;
  heroTitleLine2_fr: string;
  heroDescription_en: string;
  heroDescription_fr: string;
  typingWords_en: string[];
  typingWords_fr: string[];
  techStack: string[];
  bio_en: string;
  bio_fr: string;
  quote_en: string;
  quote_fr: string;
  experienceSince: string | null;
  metaTitle: string;
  metaDescription: string;
}

