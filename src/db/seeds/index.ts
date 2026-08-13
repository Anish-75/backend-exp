import { db } from "../index";
import {
  roles,
  permissions,
  rolePermissions,
  institutions,
  users,
} from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

// ─── Seed Data Definitions ──────────────────────────────────────

const ROLES = [
  { name: "SUPERADMIN", scope: "PLATFORM"  as const },
  { name: "INSTADMIN",  scope: "INSTITUTE" as const },
  { name: "USER",       scope: "INSTITUTE" as const },
];

const PERMISSIONS = [
  // Institution management — SuperAdmin only
  { name: "inst:create"      },
  { name: "inst:update"      },
  { name: "inst:delete"      },
  // InstAdmin management — SuperAdmin only
  { name: "instadmin:create" },
  { name: "instadmin:update" },
  { name: "instadmin:delete" },
  // User management — InstAdmin only
  { name: "user:create"      },
  { name: "user:update"      },
  { name: "user:delete"      },
  // Self-service password reset — SuperAdmin + InstAdmin
  { name: "password:reset"   },
];

// Which permissions belong to which role
const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  SUPERADMIN: [
    "inst:create",
    "inst:update",
    "inst:delete",
    "instadmin:create",
    "instadmin:update",
    "instadmin:delete",
    "password:reset",
  ],
  INSTADMIN: [
    "user:create",
    "user:update",
    "user:delete",
    "password:reset",
  ],
  USER: [
    // No permissions currently
    // Future: add course:view, result:view, etc.
  ],
};

// ─── Main Seed Function ─────────────────────────────────────────

export async function seed() {
  console.log("🌱 Starting database seed...\n");

  // ── 1. Seed Roles ─────────────────────────────────────────────
  console.log("📌 Seeding roles...");
  const insertedRoles: Record<string, string> = {}; // name -> id

  for (const role of ROLES) {
    // upsert: insert if not exists, skip if already there
    const existing = await db
      .select()
      .from(roles)
      .where(eq(roles.name, role.name))
      .limit(1);

    if (existing.length > 0) {
      insertedRoles[role.name] = existing[0].id;
      console.log(`  ⏭  Role already exists: ${role.name}`);
    } else {
      const [inserted] = await db
        .insert(roles)
        .values(role)
        .returning();
      insertedRoles[role.name] = inserted.id;
      console.log(`  ✅ Created role: ${role.name}`);
    }
  }

  // ── 2. Seed Permissions ───────────────────────────────────────
  console.log("\n📌 Seeding permissions...");
  const insertedPermissions: Record<string, string> = {}; // name -> id

  for (const permission of PERMISSIONS) {
    const existing = await db
      .select()
      .from(permissions)
      .where(eq(permissions.name, permission.name))
      .limit(1);

    if (existing.length > 0) {
      insertedPermissions[permission.name] = existing[0].id;
      console.log(`  ⏭  Permission already exists: ${permission.name}`);
    } else {
      const [inserted] = await db
        .insert(permissions)
        .values(permission)
        .returning();
      insertedPermissions[permission.name] = inserted.id;
      console.log(`  ✅ Created permission: ${permission.name}`);
    }
  }

  // ── 3. Seed Role-Permission Mappings ──────────────────────────
  console.log("\n📌 Seeding role-permission mappings...");

  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSION_MAP)) {
    const roleId = insertedRoles[roleName];

    for (const permName of permNames) {
      const permissionId = insertedPermissions[permName];

      // Check if mapping already exists (composite PK will reject duplicates anyway)
      const existing = await db
        .select()
        .from(rolePermissions)
        .where(
          eq(rolePermissions.roleId, roleId)
          // We check both columns manually
        )
        .limit(1);

      // Simple approach: try insert, ignore conflict
      try {
        await db
          .insert(rolePermissions)
          .values({ roleId, permissionId })
          .onConflictDoNothing();

        console.log(`  ✅ Mapped ${roleName} -> ${permName}`);
      } catch {
        console.log(`  ⏭  Mapping already exists: ${roleName} -> ${permName}`);
      }
    }
  }

  // ── 4. Seed Platform Institution (for SuperAdmin) ─────────────
  console.log("\n📌 Seeding platform institution...");

  let platformInstId: string;

  const existingInst = await db
    .select()
    .from(institutions)
    .where(eq(institutions.code, "PLATFORM"))
    .limit(1);

  if (existingInst.length > 0) {
    platformInstId = existingInst[0].id;
    console.log("  ⏭  Platform institution already exists");
  } else {
    const [inst] = await db
      .insert(institutions)
      .values({
        code:         "PLATFORM",
        name:         "Platform Administration",
        contactPhone: process.env.SUPERADMIN_PHONE || "0000000000",
        contactEmail: process.env.SUPERADMIN_EMAIL || "admin@platform.com",
        status:       "ACTIVE",
      })
      .returning();

    platformInstId = inst.id;
    console.log("  ✅ Platform institution created");
  }

  // ── 5. Seed SuperAdmin User ───────────────────────────────────
  console.log("\n📌 Seeding SuperAdmin user...");

  const superAdminPhone =
    process.env.SUPERADMIN_PHONE || "0000000000";

  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.phoneNumber, superAdminPhone))
    .limit(1);

  if (existingAdmin.length > 0) {
    console.log("  ⏭  SuperAdmin already exists");
  } else {
    const superAdminPassword =
      process.env.SUPERADMIN_PASSWORD || "SuperAdmin@123";

    const hashedPassword = await bcrypt.hash(superAdminPassword, 12);

    await db.insert(users).values({
      instId:         platformInstId,
      phoneNumber:    superAdminPhone,
      password:       hashedPassword,
      roleId:         insertedRoles["SUPERADMIN"],
      isTempPassword: false, // SuperAdmin password is pre-set, not temp
      status:         "ACTIVE",
    });

    console.log("  ✅ SuperAdmin created");
    console.log(`     Phone:    ${superAdminPhone}`);
    console.log(`     Password: ${superAdminPassword}`);
    console.log("     ⚠️  Change this password immediately in production!");
  }

  console.log("\n✅ Seed completed successfully!\n");
  process.exit(0);
}

// Run seed
seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});