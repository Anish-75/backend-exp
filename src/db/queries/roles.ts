import { eq } from "drizzle-orm";
import { db } from "../index";
import { roles, Role } from "../schema";

// GET role by name (most common lookup)
export async function getRoleByName(
  name: string
): Promise<Role | undefined> {
  const result = await db
    .select()
    .from(roles)
    .where(eq(roles.name, name))
    .limit(1);
  return result[0];
}

// GET all roles
export async function getAllRoles(): Promise<Role[]> {
  return await db.select().from(roles);
}

// GET role by ID
export async function getRoleById(
  id: string
): Promise<Role | undefined> {
  const result = await db
    .select()
    .from(roles)
    .where(eq(roles.id, id))
    .limit(1);
  return result[0];
}