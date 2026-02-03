import { pgTable, text, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").default(""), // SVG icon filename (e.g., "reactjs.svg")
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  img: text("img").default(""), // Project image URL
  technologies: jsonb("technologies").$type<string[]>().default([]),
  github: text("github").default(""),
  live: text("live").default(""),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const experiences = pgTable("experiences", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").default(""),
  period: text("period").notNull(),
  type: text("type").default(""), // e.g., "Freelance", "Internship", "Full-time"
  description: text("description").default(""),
  responsibilities: jsonb("responsibilities").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const education = pgTable("education", {
  id: text("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  location: text("location").default(""),
  period: text("period").notNull(),
  description: text("description").default(""),
  achievements: jsonb("achievements").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const hobbies = pgTable("hobbies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").default(""),
  icon: text("icon").default(""), // Lucide icon name (e.g., "Dumbbell", "Heart")
  color: text("color").default(""), // Tailwind gradient class (e.g., "from-rose-500 to-pink-600")
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contact = pgTable("contact", {
  id: text("id").primaryKey(),
  email: text("email").default(""),
  phone: text("phone").default(""),
  location: text("location").default(""),
  github: text("github").default(""),
  linkedin: text("linkedin").default(""),
  twitter: text("twitter").default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  read: boolean("read").default(false),
}, (table) => [
  index("idx_messages_read").on(table.read),
  index("idx_messages_date").on(table.date),
]);

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").default(""),
  company: text("company").default(""),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  isPinned: boolean("is_pinned").default(false),
}, (table) => [
  index("idx_testimonials_status").on(table.status),
]);

export const resumes = pgTable("resumes", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  fileUrl: text("file_url").notNull(),
  isActive: boolean("is_active").default(false),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
