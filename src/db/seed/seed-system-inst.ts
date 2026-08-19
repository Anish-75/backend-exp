import { db } from "../client.js";
import { inst } from "../schema/inst.schema.js";
import { eq } from "drizzle-orm";

export async function seedSystemInst() {
  const [row] = await db
    .insert(inst)
    .values({ code: "SYS", name: "System", phoneNumber: "0000000000" })
    .onConflictDoNothing({ target: inst.code })
    .returning();

  if (row) return row;

  const [existing] = await db.select().from(inst).where(eq(inst.code, "SYS"));
  return existing;
}
