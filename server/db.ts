import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a database connection
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client);
