import { auth } from "../../lib/auth";
import { db } from "../client";
import { roles, inst, user } from "../schema";
import { eq } from "drizzle-orm";
import { generateTempPassword } from "../../modules/auth/password.util";

export async function seedSuperAdmin() {
  const [existingUser] = await db.select().from(user).where(eq(user.email, "superadmin@school-erp.local"));
  if (existingUser) {
    console.log("SuperAdmin already exists. Skipping.");
    return;
  }

  const [superRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "SUPERADMIN"));
  const [systemInst] = await db.select().from(inst).where(eq(inst.code, "SYS"));

  const tempPassword = generateTempPassword();

  const result = await auth.api.signUpEmail({
    body: {
      email: "superadmin@school-erp.local",
      password: tempPassword,
      name: "Super Admin",
      inst_id: systemInst.id,
      role_id: superRole.id,
      is_temp_password: true,
    },
  });

  console.log(
    "SuperAdmin created. Temp password (save this now):",
    tempPassword,
  );
  return result;
}
