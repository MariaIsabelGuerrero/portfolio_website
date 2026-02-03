import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";
import { createHash } from "crypto";

// Helper function to create a privacy-safe identifier from email
function getPrivacySafeEmailIdentifier(email: string): string {
  return createHash("sha256")
    .update(email.toLowerCase().trim())
    .digest("hex")
    .substring(0, 16);
}

// Helper function to truncate email for logging (shows first 3 chars + domain)
function getTruncatedEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) return "***@***";
  const truncatedLocal =
    localPart.length > 3 ? `${localPart.substring(0, 3)}***` : "***";
  return `${truncatedLocal}@${domain}`;
}

// Get connection string - use placeholder during build, real value at runtime
const connectionString =
  process.env.DATABASE_URL || "postgres://build:build@localhost:5432/build";

// Create postgres connection
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Validate environment variables at runtime (not during build)
function validateEnvironment() {
  // Skip validation during build time
  if (
    process.env.NEXT_PHASE === "phase-production-build" ||
    (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL)
  ) {
    return;
  }

  // Client-side, skip validation
  if (typeof window !== "undefined") {
    return;
  }

  const betterAuthSecret =
    process.env.BETTER_AUTH_SECRET || process.env.AUTH_JWT_SECRET;
  const jwtSecret =
    process.env.BETTER_AUTH_JWT_SECRET ||
    process.env.AUTH_JWT_SECRET ||
    process.env.BETTER_AUTH_SECRET;
  const databaseUrl = process.env.DATABASE_URL;
  const baseUrl = process.env.BETTER_AUTH_URL;

  if (!betterAuthSecret || betterAuthSecret.length < 32) {
    throw new Error(
      "BETTER_AUTH_SECRET or AUTH_JWT_SECRET must be set and be at least 32 characters long."
    );
  }

  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error(
      "BETTER_AUTH_JWT_SECRET or AUTH_JWT_SECRET must be set and be at least 32 characters long."
    );
  }

  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required.");
  }

  if (!baseUrl) {
    throw new Error("BETTER_AUTH_URL environment variable is required.");
  }
}

// Validate environment when module is actually used (runtime)
let validationDone = false;
function ensureValidated() {
  if (!validationDone && typeof window === "undefined") {
    validateEnvironment();
    validationDone = true;
  }
}

// Parse CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : ["http://localhost:3000"];

// Create auth instance
export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.AUTH_JWT_SECRET ||
    "build-time-placeholder-secret-must-be-32-chars-min",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  trustedOrigins: corsOrigins,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  jwt: {
    secret:
      process.env.BETTER_AUTH_JWT_SECRET ||
      process.env.AUTH_JWT_SECRET ||
      process.env.BETTER_AUTH_SECRET ||
      "build-time-placeholder-secret-must-be-32-chars-min",
    issuer: process.env.AUTH_JWT_ISS || "portfolio-auth",
    audience: process.env.AUTH_JWT_AUD || "portfolio-api",
    expiresIn: "1h",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
      locale: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

// Export helpers for use in other modules
export { getPrivacySafeEmailIdentifier, getTruncatedEmail, ensureValidated };
