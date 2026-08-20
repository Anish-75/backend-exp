import { prisma } from "../client.js";

const ROLE_SEED = [
  { name: "SUPERADMIN", display_name: "Super Admin", scope: "PLATFORM" as const },
  { name: "INSTADMIN", display_name: "Institute Admin", scope: "INSTITUTE" as const },
  { name: "ADMIN", display_name: "Admin", scope: "INSTITUTE" as const },
];

const BASE_PERMISSIONS = [
  "inst:create", "inst:read", "inst:update", "inst:delete",
  "user:create", "user:read", "user:update", "user:delete",
  "role:manage",
];

export async function seedRolesAndPermissions() {
  const insertedRoles = await Promise.all(
    ROLE_SEED.map((r) =>
      prisma.roles.upsert({
        where: { name: r.name },
        update: {},
        create: r,
      })
    )
  );

  const insertedPerms = await Promise.all(
    BASE_PERMISSIONS.map((name) =>
      prisma.permissions.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const superadmin = insertedRoles.find((r) => r.name === "SUPERADMIN");
  if (superadmin) {
    await prisma.role_permissions.createMany({
      data: insertedPerms.map((p) => ({
        role_id: superadmin.id,
        permission_id: p.id,
      })),
      skipDuplicates: true,
    });
  }

  return { roles: insertedRoles, permissions: insertedPerms };
}