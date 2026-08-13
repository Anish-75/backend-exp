import { eq, and, ne } from "drizzle-orm";
import { db } from "../index";
import {
  institutions,
  Institution,
  NewInstitution,
} from "../schema";

// GET all institutions (non-deleted)
export async function getAllInstitutions(): Promise<Institution[]> {
  return await db
    .select()
    .from(institutions)
    .where(ne(institutions.status, "DELETED"));
}

// GET institution by ID
export async function getInstitutionById(
  id: string
): Promise<Institution | undefined> {
  const result = await db
    .select()
    .from(institutions)
    .where(
      and(
        eq(institutions.id, id),
        ne(institutions.status, "DELETED")
      )
    )
    .limit(1);
  return result[0];
}

// GET institution by code
export async function getInstitutionByCode(
  code: string
): Promise<Institution | undefined> {
  const result = await db
    .select()
    .from(institutions)
    .where(eq(institutions.code, code))
    .limit(1);
  return result[0];
}

// CREATE institution
export async function createInstitution(
  data: NewInstitution
): Promise<Institution> {
  const [institution] = await db
    .insert(institutions)
    .values(data)
    .returning();
  return institution;
}

// UPDATE institution
export async function updateInstitution(
  id: string,
  data: Partial<NewInstitution>
): Promise<Institution | undefined> {
  const [updated] = await db
    .update(institutions)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(
        eq(institutions.id, id),
        ne(institutions.status, "DELETED")
      )
    )
    .returning();
  return updated;
}

// SOFT DELETE institution (set status = DELETED)
export async function deleteInstitution(
  id: string
): Promise<boolean> {
  const [deleted] = await db
    .update(institutions)
    .set({ status: "DELETED", updatedAt: new Date() })
    .where(eq(institutions.id, id))
    .returning();
  return !!deleted;
}

// Update createdBy after SuperAdmin user is created
// (needed because of the circular dependency: inst needs user.id,
//  but user needs inst.id — so we create inst first, user second,
//  then update inst.created_by)
export async function setInstitutionCreatedBy(
  instId: string,
  userId: string
): Promise<void> {
  await db
    .update(institutions)
    .set({ createdBy: userId, updatedAt: new Date() })
    .where(eq(institutions.id, instId));
}