import { prisma } from "../../db/client.js";
import { createInstAdmin, CreateInstAdminInput } from "../inst-admin/inst-admin.service.js";

export interface CreateInstitutionInput {
  code: string;
  name: string;
  address?: string;
  phone_number?: string;
  contact_email?: string;
}

export async function createInstitution(data: CreateInstitutionInput, callerId: string) {
  return prisma.inst.create({
    data: { ...data, created_by: callerId, updated_by: callerId },
  });
}

export async function createInstitutionWithAdmin(
  instData: CreateInstitutionInput,
  adminData: CreateInstAdminInput,
  callerId: string 
) {
  const instRow = await prisma.inst.create({
    data: { ...instData, created_by: callerId, updated_by: callerId }, 
  });

  try {
    const { user, tempPassword } = await createInstAdmin(instRow.id, adminData, callerId); 
    return { inst: instRow, admin: user, tempPassword };
  } catch (err) {
    await prisma.inst.delete({ where: { id: instRow.id } });
    throw err;
  }
}

export async function updateInstitution(
  instId: string,
  data: Partial<CreateInstitutionInput>,
  callerId: string 
) {
  return prisma.inst.update({
    where: { id: instId },
    data: { ...data, updated_by: callerId, updated_on: new Date() }, 
  });
}

export async function deleteInstitution(instId: string, callerId: string) {
  return prisma.inst.update({
    where: { id: instId },
    data: { is_archived: true, is_active: false, updated_by: callerId, updated_on: new Date() }, 
  });
}