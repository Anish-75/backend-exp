import { prisma } from "../client.js";

const ROLE_SEED = [
  { name: "SUPERADMIN", display_name: "Super Admin", scope: "PLATFORM" as const },
  { name: "INSTADMIN", display_name: "Institute Admin", scope: "INSTITUTE" as const },
  { name: "ADMIN", display_name: "Admin", scope: "INSTITUTE" as const },
];

const BASE_PERMISSIONS = [
  "inst:create",
  "inst:read",
  "inst:update",
  "inst:delete",
  "role:manage",
  "admin:create",
  "user:create",
  "user:read",
  "user:list",
  "user:update",
  "user:delete",
  "user:reset_password",
  "password:change_self",
];

const INSTADMIN_PERMISSIONS = [
  "user:create",
  "user:read",
  "user:list",
  "user:update",
  "user:delete",
  "user:reset_password",
  "password:change_self",
];

const ADMIN_PERMISSIONS = [
  "user:read",
  "password:change_self",
];

export async function seedRolesAndPermissions() {
  const insertedRoles = await Promise.all(
    ROLE_SEED.map((r) =>
      prisma.roles.upsert({
        where: { name: r.name },
        update: { display_name: r.display_name, scope: r.scope },
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

  const permMap = new Map(insertedPerms.map((p) => [p.name, p.id]));

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

  const instadmin = insertedRoles.find((r) => r.name === "INSTADMIN");
  if (instadmin) {
    const instAdminPermIds = INSTADMIN_PERMISSIONS
      .map((name) => permMap.get(name))
      .filter((id): id is string => Boolean(id));

    await prisma.role_permissions.createMany({
      data: instAdminPermIds.map((permId) => ({
        role_id: instadmin.id,
        permission_id: permId,
      })),
      skipDuplicates: true,
    });
  }

  // ✅ new — assign ADMIN its permissions
  const admin = insertedRoles.find((r) => r.name === "ADMIN");
  if (admin) {
    const adminPermIds = ADMIN_PERMISSIONS
      .map((name) => permMap.get(name))
      .filter((id): id is string => Boolean(id));

    await prisma.role_permissions.createMany({
      data: adminPermIds.map((permId) => ({
        role_id: admin.id,
        permission_id: permId,
      })),
      skipDuplicates: true,
    });
  }

  return { roles: insertedRoles, permissions: insertedPerms };
}