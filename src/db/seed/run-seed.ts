import { seedSystemInst } from "./seed-system-inst";
import { seedRolesAndPermissions } from "./seed-roles-permissions";
import { seedSuperAdmin } from "./seed-superadmin";
import { closePool } from "../client";
 
async function main() {
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
