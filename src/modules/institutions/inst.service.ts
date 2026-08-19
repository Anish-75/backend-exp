import { db } from "../../db/client.js";
import { inst } from "../../db/schema/inst.schema.js";
import { eq } from "drizzle-orm";
import { createInstAdmin } from "../inst-admin/inst-admin.service.js";
 
export interface CreateInstitutionInput {
  code: string;
  name: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  createdBy?: string;
}
 
export async function createInstitution(data: CreateInstitutionInput) {
  return db.transaction(async (tx) => {
    const [row] = await tx.insert(inst).values(data).returning();
    return row;
  });
}

export async function createInstitutionWithAdmin(
  instData: CreateInstitutionInput,
  adminPhoneNumber: string
) {
  const [instRow] = await db.insert(inst).values(instData).returning();
 
  try {
    const { user, tempPassword } = await createInstAdmin(instRow.id, adminPhoneNumber);
    return { inst: instRow, admin: user, tempPassword };
  } catch (err) {
    await db.delete(inst).where(eq(inst.id, instRow.id));
    throw err;
  }
}