import { auth } from "../../lib/auth.js";
import { prisma } from "../../db/client.js";
import { generateTempPassword } from "../auth/password.utils.js";
import { deleteUser, updateUser } from "../users/user.service.js";

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

  return { user: result.user, tempPassword };
}

export async function updateInstAdmin(
  instId: string,
  targetUserId: string,
  data: Partial<{ name: string; email: string }>
) {
  return updateUser(instId, targetUserId, data);
}

export async function deleteInstAdmin(
  callerRoleName: string,
  targetUserId: string,
  targetInstId: string
) {
  if (callerRoleName === "INSTADMIN") {
    throw new Error("INSTADMIN cannot delete another INSTADMIN account");
  }
  return deleteUser(targetInstId, targetUserId);
}