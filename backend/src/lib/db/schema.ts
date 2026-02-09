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
  title_en: text("title_en").notNull().default(""),
  title_fr: text("title_fr").default(""),
  description_en: text("description_en").notNull().default(""),
  description_fr: text("description_fr").default(""),
  img: text("img").default(""),
  technologies: jsonb("technologies").$type<string[]>().default([]),
  github: text("github").default(""),
  live: text("live").default(""),
  keyFeatures_en: jsonb("key_features_en").$type<string[]>().default([]),
  keyFeatures_fr: jsonb("key_features_fr").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const experiences = pgTable("experiences", {
  id: text("id").primaryKey(),
  title_en: text("title_en").notNull().default(""),
  title_fr: text("title_fr").default(""),
  company: text("company").notNull(),
  location: text("location").default(""),
  period: text("period").notNull(),
  type: text("type").default(""),
  description_en: text("description_en").default(""),
  description_fr: text("description_fr").default(""),
  responsibilities_en: jsonb("responsibilities_en").$type<string[]>().default([]),
  responsibilities_fr: jsonb("responsibilities_fr").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const education = pgTable("education", {
  id: text("id").primaryKey(),
  degree_en: text("degree_en").notNull().default(""),
  degree_fr: text("degree_fr").default(""),
  institution: text("institution").notNull(),
  location: text("location").default(""),
  period: text("period").notNull(),
  description_en: text("description_en").default(""),
  description_fr: text("description_fr").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const hobbies = pgTable("hobbies", {
  id: text("id").primaryKey(),
  name_en: text("name_en").notNull().default(""),
  name_fr: text("name_fr").default(""),
  description_en: text("description_en").default(""),
  description_fr: text("description_fr").default(""),
  icon: text("icon").default(""),
  color: text("color").default(""),
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

export const certificates = pgTable("certificates", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").default("image"), // "image" or "pdf"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
