import { db } from '../client';
import { roles, permissions, rolePermissions } from '../schema';

const ROLES = [
  { name: 'SUPERADMIN', display_name: 'Super Admin', scope: 'PLATFORM' as const },
  { name: 'INSTADMIN', display_name: 'Institution Admin', scope: 'INSTITUTE' as const },
  { name: 'ADMIN', display_name: 'Admin', scope: 'INSTITUTE' as const },
  { name: 'TEACHER', display_name: 'Teacher', scope: 'INSTITUTE' as const },
  { name: 'STUDENT', display_name: 'Student', scope: 'INSTITUTE' as const },
];

const PERMISSIONS = [
  'inst:create', 'inst:read', 'inst:update', 'inst:delete',
  'instadmin:create', 'instadmin:read', 'instadmin:update', 'instadmin:delete',
  'user:create', 'user:read', 'user:update', 'user:delete',
  'auth:reset_password',
];

const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  SUPERADMIN: ['inst:create', 'inst:read', 'inst:update', 'inst:delete',
    'instadmin:create', 'instadmin:read', 'instadmin:update', 'instadmin:delete',
    'auth:reset_password'],
  INSTADMIN: ['user:create', 'user:read', 'user:update', 'user:delete', 'auth:reset_password'],
  ADMIN: [],
  TEACHER: [],
  STUDENT: [],
};

export async function seedRolesAndPermissions() {
  const insertedRoles = await db.insert(roles).values(ROLES).onConflictDoNothing({ target: roles.name }).returning();
  const insertedPerms = await db.insert(permissions).values(PERMISSIONS.map((name) => ({ name })))
    .onConflictDoNothing({ target: permissions.name }).returning();

  // fetch full sets in case of onConflict skip (returning() only gives newly inserted rows)
  const allRoles = await db.select().from(roles);
  const allPerms = await db.select().from(permissions);

  const rows = [];
  for (const role of allRoles) {
    const permNames = ROLE_PERMISSION_MAP[role.name] ?? [];
    for (const permName of permNames) {
      const perm = allPerms.find((p) => p.name === permName);
      if (perm) rows.push({ role_id: role.id, permission_id: perm.id });
    }
  }

  if (rows.length) {
    await db.insert(rolePermissions).values(rows).onConflictDoNothing();
  }

  console.log(`Roles: ${allRoles.length}, Permissions: ${allPerms.length}, RolePermissions: ${rows.length}`);
  return { allRoles, allPerms };
}