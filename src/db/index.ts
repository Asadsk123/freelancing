import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let _db: ReturnType<typeof createDb> | undefined;

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local to connect to Neon PostgreSQL.",
    );
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL;
}

export function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

export type Database = ReturnType<typeof getDb>;
