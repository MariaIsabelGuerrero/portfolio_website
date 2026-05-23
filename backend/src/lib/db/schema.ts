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
  relationship: text("relationship").default(""),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
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

export const profile = pgTable("profile", {
  id: text("id").primaryKey().default("default"),
  fullName: text("full_name").notNull().default(""),
  shortName: text("short_name").notNull().default(""),
  siteUrl: text("site_url").default(""),
  profileImage: text("profile_image").default(""),
  heroBadge_en: text("hero_badge_en").default(""),
  heroBadge_fr: text("hero_badge_fr").default(""),
  heroTitleLine1_en: text("hero_title_line1_en").default(""),
  heroTitleLine1_fr: text("hero_title_line1_fr").default(""),
  heroTitleLine2_en: text("hero_title_line2_en").default(""),
  heroTitleLine2_fr: text("hero_title_line2_fr").default(""),
  heroDescription_en: text("hero_description_en").default(""),
  heroDescription_fr: text("hero_description_fr").default(""),
  typingWords_en: jsonb("typing_words_en").$type<string[]>().default([]),
  typingWords_fr: jsonb("typing_words_fr").$type<string[]>().default([]),
  techStack: jsonb("tech_stack").$type<string[]>().default([]),
  bio_en: text("bio_en").default(""),
  bio_fr: text("bio_fr").default(""),
  quote_en: text("quote_en").default(""),
  quote_fr: text("quote_fr").default(""),
  experienceSince: timestamp("experience_since"),
  metaTitle: text("meta_title").default(""),
  metaDescription: text("meta_description").default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
