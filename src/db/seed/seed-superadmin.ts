import { auth } from "../../lib/auth.js";
import { prisma } from "../client.js";
import { generateTempPassword } from "../../modules/auth/password.utils.js";

export async function seedSuperAdmin() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "superadmin@school-erp.local" },
  });
  if (existingUser) {
    console.log("SuperAdmin already exists. Skipping.");
    return;
  }

  const superRole = await prisma.roles.findUnique({
    where: { name: "SUPERADMIN" },
  });
  if (!superRole) throw new Error("SUPERADMIN role not found — run seedRolesAndPermissions first");

  const systemInst = await prisma.inst.findUnique({
    where: { code: "SYS" },
  });
  if (!systemInst) throw new Error("System inst not found — run seedSystemInst first");

  const tempPassword = generateTempPassword();

  const result = await auth.api.signUpEmail({
    body: {
      email: "superadmin@school-erp.local",
      password: tempPassword,
      name: "Super Admin",
      inst_id: systemInst.id,
      role_id: superRole.id,
      is_temp_password: true,
      is_active: true,
      is_archived: false,
      phoneNumber: systemInst.phone_number, // API key stays camelCase — Better Auth's phoneNumber plugin convention
    },
  });

  if (result?.user) {
    await prisma.user.update({
      where: { id: result.user.id },
      data: { phoneNumberVerified: true },
    });
  }

  console.log(
    "SuperAdmin created. Temp password (save this now):",
    tempPassword,
  );
  return result;
}