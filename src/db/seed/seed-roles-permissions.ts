import { db } from "../client.js";
import { roles, permissions, rolePermissions } from "../schema/index.js";
 
const ROLE_SEED = [
  { name: "SUPERADMIN", displayName: "Super Admin", scope: "PLATFORM" as const },
  { name: "INSTADMIN", displayName: "Institute Admin", scope: "INSTITUTE" as const },
  { name: "ADMIN", displayName: "Admin", scope: "INSTITUTE" as const },
] as const;
 
const BASE_PERMISSIONS = [
  "inst:create", "inst:read", "inst:update", "inst:delete",
  "user:create", "user:read", "user:update", "user:delete",
  "role:manage",
];
 
export async function seedRolesAndPermissions() {
  const insertedRoles = await db
    .insert(roles)
    .values(ROLE_SEED.map((r) => ({ name: r.name, displayName: r.displayName, scope: r.scope })))
    .onConflictDoNothing({ target: roles.name })
    .returning();
 
  const insertedPerms = await db
    .insert(permissions)
    .values(BASE_PERMISSIONS.map((name) => ({ name })))
    .onConflictDoNothing({ target: permissions.name })
    .returning();
 
  const superadmin = insertedRoles.find((r) => r.name === "SUPERADMIN");
  if (superadmin) {
    await db
      .insert(rolePermissions)
      .values(insertedPerms.map((perm) => ({ roleId: superadmin.id, permissionId: perm.id })))
      .onConflictDoNothing();
  }
 
  return { roles: insertedRoles, permissions: insertedPerms };
}
