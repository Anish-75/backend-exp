import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index.js";
 
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});
 
export const db = drizzle(pool, { schema });

export async function closePool() {
  await pool.end();
}
