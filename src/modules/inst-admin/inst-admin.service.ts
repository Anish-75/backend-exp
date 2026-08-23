import { auth } from "../../lib/auth.js";
import { prisma } from "../../db/client.js";
import { generateTempPassword } from "../auth/password.utils.js";

export async function createInstAdmin(instId: string, phoneNumber: string) {
  const instAdminRole = await prisma.roles.findUnique({ where: { name: "INSTADMIN" } });
  if (!instAdminRole) throw new Error("INSTADMIN role not found — run seedRolesAndPermissions first");

  const tempPassword = generateTempPassword();

  const result = await auth.api.signUpEmail({
    body: {
      email: `${phoneNumber}@placeholder.school-erp.local`,
      password: tempPassword,
      name: phoneNumber,
      phoneNumber: phoneNumber,
      inst_id: instId,
      role_id: instAdminRole.id,
      is_temp_password: true,
      is_active: true,
      is_archived: false,
    },
  });

  if (result?.user) {
    await prisma.user.update({
      where: { id: result.user.id },
      data: { phoneNumberVerified: true }, //  new — consistent with seed-superadmin.ts
    });
  }

  return { user: result.user, tempPassword };
}