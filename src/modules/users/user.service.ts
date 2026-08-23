import { auth } from "../../lib/auth.js";
import { prisma } from "../../db/client.js";
import { generateTempPassword } from "../auth/password.utils.js";

export async function createUser(
  instId: string,
  phoneNumber: string,
  role: string,
  email?: string
) {
  const userRole = await prisma.roles.findUnique({ where: { name: role } });
  if (!userRole) throw new Error(`Unknown role: ${role}`);

  const tempPassword = generateTempPassword();

  const result = await auth.api.signUpEmail({
    body: {
      email: email ?? `${phoneNumber}@placeholder.school-erp.local`,
      password: tempPassword,
      name: phoneNumber,
      phoneNumber: phoneNumber,
      inst_id: instId,
      role_id: userRole.id,
      is_temp_password: true,
      is_active: true,
      is_archived: false,
    },
  });

  if (result?.user) {
    await prisma.user.update({
      where: { id: result.user.id },
      data: { phoneNumberVerified: true }, // new
    });
  }

  return { user: result.user, tempPassword };
}

export async function setNewPassword(userId: string) {
  const row = await prisma.user.update({
    where: { id: userId },
    data: { is_temp_password: false },
  });

  return row;
}

export async function updateUser(
  instId: string,
  userId: string,
  data: Partial<{ name: string; email: string }>
) {
  const existing = await prisma.user.findFirst({ where: { id: userId, inst_id: instId } });
  if (!existing) throw new Error("User not found in this institute");

  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function deleteUser(instId: string, userId: string) {
  const existing = await prisma.user.findFirst({ where: { id: userId, inst_id: instId } });
  if (!existing) throw new Error("User not found in this institute");
  const row = await prisma.user.update({
    where: { id: userId },
    data: { is_archived: true, is_active: false },
  });
  await prisma.session.deleteMany({ where: { userId } });
  return row;
}