
import { db } from "../client";
import { inst } from "../schema";
import { eq } from "drizzle-orm";
 
export async function seedSystemInst() {
  const [row] = await db
    .insert(inst)
    .values({ code: "SYS", name: "System", contactPhone: "0000000000" })
    .onConflictDoNothing({ target: inst.code })
    .returning();
 
  if (row) return row;
 
  // already exists — fetch and return it so downstream seeds still work
  const [existing] = await db.select().from(inst).where(eq(inst.code, "SYS"));
  return existing;
}
