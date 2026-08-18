import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env";
import * as schema from "./schema";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
});

pool.on("connect", async (client) => {
  await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
});

export const db = drizzle(pool, { schema });

export async function ensureDatabaseBootstrap() {
  await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
}

export async function closePool() {
  await pool.end();
}
