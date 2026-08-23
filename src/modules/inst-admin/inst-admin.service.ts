import { auth } from "../../lib/auth.js";
import { prisma } from "../../db/client.js";
import { generateTempPassword } from "../auth/password.utils.js";
import { deleteUser, updateUser } from "../users/user.service.js";

export interface CreateInstAdminInput {
  phoneNumber: string;
  name?: string;   
  email?: string;  
}

export async function createInstAdmin(instId: string, input: CreateInstAdminInput) {
  const { phoneNumber, name, email } = input;

  const instAdminRole = await prisma.roles.findUnique({ where: { name: "INSTADMIN" } });
  if (!instAdminRole) throw new Error("INSTADMIN role not found — run seedRolesAndPermissions first");


  const existingActive = await prisma.user.findFirst({
    where: { inst_id: instId, role_id: instAdminRole.id, is_archived: false },
  });
  if (existingActive) {
    throw new Error("This institution already has an active InstAdmin — archive it before creating a replacement");
  }

  const tempPassword = generateTempPassword();

  const result = await auth.api.signUpEmail({
    body: {
      email: email ?? `${phoneNumber}@placeholder.school-erp.local`, 
      password: tempPassword,
      name: name ?? phoneNumber,                                      
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
      data: { phoneNumberVerified: true },
    });
  }

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