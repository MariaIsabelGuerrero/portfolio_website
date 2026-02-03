import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://portfolio_user:portfolio_pass@localhost:5433/portfolio_db";

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
