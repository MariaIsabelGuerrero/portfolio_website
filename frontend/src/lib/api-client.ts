import { authClient } from "./auth-client";

const apiUrl =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"
    : process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3003";

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const tokenRes = await authClient.token();
    const token = tokenRes?.data?.token;
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    }
  } catch {
    // Token unavailable
  }
  return { "Content-Type": "application/json" };
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ---- Skills ----
export async function fetchSkills() {
  return apiFetch<{ data: Skill[] }>("/api/skills");
}

export async function createSkill(data: { name: string; icon?: string }) {
  return apiFetch<{ data: Skill }>("/api/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSkill(id: string, data: Partial<Skill>) {
  return apiFetch<{ data: Skill }>(`/api/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(id: string) {
  return apiFetch(`/api/skills/${id}`, { method: "DELETE" });
}

// ---- Projects ----
export async function fetchProjects() {
  return apiFetch<{ data: Project[] }>(`/api/projects`);
}

export async function fetchProject(id: string) {
  return apiFetch<{ data: Project }>(`/api/projects/${id}`);
}

export async function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">) {
  return apiFetch<{ data: Project }>("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(id: string, data: Partial<Project>) {
  return apiFetch<{ data: Project }>(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string) {
  return apiFetch(`/api/projects/${id}`, { method: "DELETE" });
}

// ---- Experience ----
export async function fetchExperience() {
  return apiFetch<{ data: Experience[] }>("/api/experience");
}

export async function createExperience(data: Omit<Experience, "id" | "createdAt" | "updatedAt">) {
  return apiFetch<{ data: Experience }>("/api/experience", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExperience(id: string, data: Partial<Experience>) {
  return apiFetch<{ data: Experience }>(`/api/experience/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteExperience(id: string) {
  return apiFetch(`/api/experience/${id}`, { method: "DELETE" });
}

// ---- Education ----
export async function fetchEducation() {
  return apiFetch<{ data: Education[] }>("/api/education");
}

export async function createEducation(data: Omit<Education, "id" | "createdAt" | "updatedAt">) {
  return apiFetch<{ data: Education }>("/api/education", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEducation(id: string, data: Partial<Education>) {
  return apiFetch<{ data: Education }>(`/api/education/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEducation(id: string) {
  return apiFetch(`/api/education/${id}`, { method: "DELETE" });
}

// ---- Hobbies ----
export async function fetchHobbies() {
  return apiFetch<{ data: Hobby[] }>("/api/hobbies");
}

export async function createHobby(data: Omit<Hobby, "id" | "createdAt" | "updatedAt">) {
  return apiFetch<{ data: Hobby }>("/api/hobbies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateHobby(id: string, data: Partial<Hobby>) {
  return apiFetch<{ data: Hobby }>(`/api/hobbies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteHobby(id: string) {
  return apiFetch(`/api/hobbies/${id}`, { method: "DELETE" });
}

// ---- Contact ----
export async function fetchContact() {
  return apiFetch<{ data: ContactInfo }>("/api/contact");
}

export async function updateContact(data: ContactInfo) {
  return apiFetch<{ data: ContactInfo }>("/api/contact", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ---- Messages ----
export async function fetchMessages(status?: string) {
  const params = status ? `?status=${status}` : "";
  return apiFetch<{ data: Message[]; count: number }>(`/api/messages${params}`);
}

export async function markMessageRead(id: string, read: boolean) {
  return apiFetch<{ data: Message }>(`/api/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ read }),
  });
}

export async function deleteMessage(id: string) {
  return apiFetch(`/api/messages/${id}`, { method: "DELETE" });
}

// ---- Testimonials ----
export async function fetchTestimonials(all?: boolean, status?: string) {
  const params = new URLSearchParams();
  if (all) params.set("all", "true");
  if (status) params.set("status", status);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<{ data: Testimonial[]; count: number }>(`/api/testimonials${qs}`);
}

export async function updateTestimonialStatus(id: string, status: string) {
  return apiFetch<{ data: Testimonial }>(`/api/testimonials/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function updateTestimonialPin(id: string, isPinned: boolean) {
  return apiFetch<{ data: Testimonial }>(`/api/testimonials/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isPinned }),
  });
}

export async function deleteTestimonial(id: string) {
  return apiFetch(`/api/testimonials/${id}`, { method: "DELETE" });
}

// ---- Dashboard ----
export async function fetchDashboardStats() {
  return apiFetch<{
    data: {
      skills: number;
      projects: number;
      experience: number;
      education: number;
      hobbies: number;
      unreadMessages: number;
      pendingTestimonials: number;
    };
  }>("/api/dashboard/stats");
}

// ---- Resume ----
export async function fetchResumes(all?: boolean) {
  const params = all ? "?all=true" : "";
  return apiFetch<{ data: ResumeFile[] }>(`/api/resume${params}`);
}

export async function uploadResume(file: File) {
  const headers = await getAuthHeaders();
  delete headers["Content-Type"];
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${apiUrl}/api/resume/upload`, {
    method: "POST",
    headers: { Authorization: headers.Authorization || "" },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Upload failed");
  }

  return res.json() as Promise<{ filename: string; fileUrl: string; size: number; uploadedAt: string }>;
}

export async function createResume(data: { filename: string; fileUrl: string; language?: string; isActive?: boolean }) {
  return apiFetch<{ data: ResumeFile }>("/api/resume", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function setActiveResume(id: string) {
  return apiFetch<{ data: ResumeFile }>(`/api/resume/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isActive: true }),
  });
}

export async function deleteResume(id: string) {
  return apiFetch(`/api/resume/${id}`, { method: "DELETE" });
}

// ---- Certificates ----
export async function fetchCertificates() {
  return apiFetch<{ data: CertificateFile[] }>("/api/certificates");
}

export async function uploadCertificate(file: File) {
  const headers = await getAuthHeaders();
  delete headers["Content-Type"];
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${apiUrl}/api/certificates/upload`, {
    method: "POST",
    headers: { Authorization: headers.Authorization || "" },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Upload failed");
  }

  return res.json() as Promise<{ filename: string; fileUrl: string; fileType: string; size: number; uploadedAt: string }>;
}

export async function createCertificate(data: { title: string; fileUrl: string; fileType: string }) {
  return apiFetch<{ data: CertificateFile }>("/api/certificates", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteCertificate(id: string) {
  return apiFetch(`/api/certificates/${id}`, { method: "DELETE" });
}

// ---- Project Image Upload ----
export async function uploadProjectImage(file: File) {
  const headers = await getAuthHeaders();
  delete headers["Content-Type"];
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${apiUrl}/api/files/project-image`, {
    method: "POST",
    headers: { Authorization: headers.Authorization || "" },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Project image upload failed");
  }

  return res.json() as Promise<{ url: string }>;
}

// ---- Icon Upload ----
export async function uploadIcon(file: File) {
  const headers = await getAuthHeaders();
  delete headers["Content-Type"];
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${apiUrl}/api/files/icon`, {
    method: "POST",
    headers: { Authorization: headers.Authorization || "" },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Icon upload failed");
  }

  return res.json() as Promise<{ url: string }>;
}

// ---- Types ----
export interface Skill {
  id: string;
  name: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id: string;
  degree_en: string;
  degree_fr: string;
  institution: string;
  location: string;
  period: string;
  description_en: string;
  description_fr: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hobby {
  id: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  icon: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  isPinned: boolean;
}

export interface ResumeFile {
  id: string;
  filename: string;
  fileUrl: string;
  isActive: boolean;
  language: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificateFile {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  createdAt?: string;
  updatedAt?: string;
}
