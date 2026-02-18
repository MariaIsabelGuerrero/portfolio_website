-- Portfolio Backend Database Schema
-- This script is idempotent (safe to run multiple times)

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Drop category column if it exists (migration from old schema)
ALTER TABLE skills DROP COLUMN IF EXISTS category;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    img TEXT DEFAULT '',
    technologies JSONB DEFAULT '[]'::jsonb,
    github TEXT DEFAULT '',
    live TEXT DEFAULT '',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT DEFAULT '',
    period TEXT NOT NULL,
    type TEXT DEFAULT '',
    description TEXT DEFAULT '',
    responsibilities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id TEXT PRIMARY KEY,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT DEFAULT '',
    period TEXT NOT NULL,
    description TEXT DEFAULT '',
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Hobbies table
CREATE TABLE IF NOT EXISTS hobbies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    icon TEXT DEFAULT '',
    color TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Contact table (singleton)
CREATE TABLE IF NOT EXISTS contact (
    id TEXT PRIMARY KEY,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    location TEXT DEFAULT '',
    github TEXT DEFAULT '',
    linkedin TEXT DEFAULT '',
    twitter TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP DEFAULT NOW() NOT NULL,
    read BOOLEAN DEFAULT FALSE
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    relationship TEXT DEFAULT '',
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT NOW() NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Migration: merge position+company into relationship
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'relationship') THEN
        ALTER TABLE testimonials ADD COLUMN relationship TEXT DEFAULT '';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'position') THEN
        UPDATE testimonials SET relationship = CONCAT(position, CASE WHEN company != '' THEN ' at ' || company ELSE '' END) WHERE (relationship IS NULL OR relationship = '') AND (position != '' OR company != '');
        ALTER TABLE testimonials DROP COLUMN position;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'company') THEN
        ALTER TABLE testimonials DROP COLUMN company;
    END IF;
END $$;

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Migration: update old resumes table if it had different columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'name') THEN
        ALTER TABLE resumes RENAME COLUMN name TO filename;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'url') THEN
        ALTER TABLE resumes RENAME COLUMN url TO file_url;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'language') THEN
        ALTER TABLE resumes ADD COLUMN language TEXT DEFAULT 'en';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'updated_at') THEN
        ALTER TABLE resumes ADD COLUMN updated_at TIMESTAMP DEFAULT NOW() NOT NULL;
    END IF;
END $$;

-- Drop old columns that are no longer needed
ALTER TABLE resumes DROP COLUMN IF EXISTS size;
ALTER TABLE resumes DROP COLUMN IF EXISTS key;
ALTER TABLE resumes DROP COLUMN IF EXISTS uploaded_at;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages (read);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages (date);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials (status);

-- Seed contact singleton row
INSERT INTO contact (id, email, phone, location, github, linkedin, twitter)
VALUES ('default', '', '', '', '', '', '')
ON CONFLICT (id) DO NOTHING;
