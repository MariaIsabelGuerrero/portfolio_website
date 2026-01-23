import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

// Get connection string - use placeholder during build, real value at runtime
const connectionString = process.env.DATABASE_URL || "postgres://build:build@localhost:5432/build";

// Create postgres connection
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Parse CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(origin => origin.trim()).filter(Boolean)
  : ["http://localhost:3000"]; // Fallback for development

// Create auth instance
export const auth = betterAuth({
  secret: (process.env.BETTER_AUTH_SECRET || process.env.AUTH_JWT_SECRET) || "build-time-placeholder-secret-must-be-32-chars-min",
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
  // Google OAuth provider (only enabled if credentials are provided)
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  jwt: {
    secret: (process.env.BETTER_AUTH_JWT_SECRET || process.env.AUTH_JWT_SECRET || process.env.BETTER_AUTH_SECRET) || "build-time-placeholder-secret-must-be-32-chars-min",
    issuer: "portfolio-auth",
    audience: "portfolio-api",
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
