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

export async function getTestimonials() {
  return publicFetch<{ data: TestimonialData[] }>("/api/testimonials");
}

export async function getCertificates() {
  return publicFetch<{ data: CertificateData[] }>("/api/certificates");
}

export async function submitTestimonial(data: { name: string; position: string; company: string; content: string }) {
  return publicFetch<{ data: TestimonialData }>("/api/testimonials", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitMessage(data: { name: string; email: string; message: string }) {
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
  position: string;
  company: string;
  content: string;
  date: string;
  status: string;
  isPinned: boolean;
}

export interface MessageData {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface CertificateData {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  createdAt?: string;
  updatedAt?: string;
}
