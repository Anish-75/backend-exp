import { db } from "../client";
import { inst } from "../schema";
import { eq } from "drizzle-orm";

export async function seedSystemInst() {
  const existing = await db.select().from(inst).where(eq(inst.code, "SYSTEM"));
  if (existing.length) {
    console.log("System inst already exists");
    return existing[0];
  }

  const [systemInst] = await db
    .insert(inst)
    .values({
      code: "SYSTEM",
      name: "System",
      contact_phone: process.env.SUPERADMIN_PHONE,
    })
    .returning();

  console.log("System inst created:", systemInst.id);
  return systemInst;
}
