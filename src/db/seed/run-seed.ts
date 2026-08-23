// src/db/seed/run-seed.ts
import "dotenv/config";
import { seedSystemInst } from "./seed-system-inst.js";
import { seedRolesAndPermissions } from "./seed-roles-permissions.js";
import { seedSuperAdmin } from "./seed-superadmin.js";
import { closePool } from "../client.js";

async function main() {
  console.log("1/3 Seeding system inst...");
  await seedSystemInst();

  console.log("2/3 Seeding roles & permissions...");
  await seedRolesAndPermissions();

  console.log("3/3 Seeding SuperAdmin...");
  await seedSuperAdmin();
 
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => closePool());
