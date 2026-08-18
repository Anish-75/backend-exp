import { execSync } from "node:child_process";
import { env } from "../../config/env";
import { closePool, ensureDatabaseBootstrap } from "../client";
import { seedSystemInst } from "./seed-system-inst";
import { seedRolesAndPermissions } from "./seed-roles-permissions";
import { seedSuperAdmin } from "./seed-superadmin";

async function main() {
  await ensureDatabaseBootstrap();

  try {
    execSync("npx drizzle-kit migrate", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: env.DATABASE_URL },
    });
  } catch (error) {
    console.error("Migration failed before seed execution.", error);
    throw error;
  }

  console.log("1/3 Seeding system inst...");
  await seedSystemInst();

  console.log("2/3 Seeding roles & permissions...");
  await seedRolesAndPermissions();

  console.log("3/3 Seeding SuperAdmin...");
  await seedSuperAdmin();

  console.log("Seed complete.");
  await closePool();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
