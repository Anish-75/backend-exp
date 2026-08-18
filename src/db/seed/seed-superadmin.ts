import { auth } from "../../lib/auth.js";          // Dev B's Better Auth instance
import { db } from "../client.js";            // Dev A's pool + drizzle() instance
import { roles, inst } from "../schema/index.js";
import { eq } from "drizzle-orm";
import { generateTempPassword } from "../../modules/auth/password.utils.js";
 
export async function seedSuperAdmin() {
  const [superRole] = await db.select().from(roles).where(eq(roles.name, "SUPERADMIN"));
  const [systemInst] = await db.select().from(inst).where(eq(inst.code, "SYS"));
 
  const tempPassword = generateTempPassword();
 
  // Created through Better Auth's server API — NOT a raw insert —
  // so hashing/storage stays identical to every account created later.
  const result = await auth.api.signUpEmail({
    body: {
      email: "superadmin@school-erp.local", // Better Auth requires an identifier field
      password: tempPassword,
      name: "Super Admin",
      inst_id: systemInst.id,
      role_id: superRole.id,
      is_temp_password: true,
      is_active: true,
      is_archived: false,
    },
  });
 
  console.log("SuperAdmin created. Temp password (save this now):", tempPassword);
  return result;
}
