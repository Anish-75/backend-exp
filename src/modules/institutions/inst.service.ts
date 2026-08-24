// src/modules/institutions/inst.service.ts
import { prisma } from "../../db/client.js";
import { createInstAdmin, CreateInstAdminInput } from "../inst-admin/inst-admin.service.js"; // ✅ import type too

export interface CreateInstitutionInput {
  code: string;
  name: string;
  address?: string;
  phone_number?: string;
  contact_email?: string;
  created_by?: string;
}

export async function createInstitution(data: CreateInstitutionInput) {
  return prisma.inst.create({ data });
}

export async function createInstitutionWithAdmin(
  instData: CreateInstitutionInput,
  adminData: CreateInstAdminInput
) {
  const instRow = await prisma.inst.create({ data: instData });

  try {
    const { user, tempPassword } = await createInstAdmin(instRow.id, adminData);
    return { inst: instRow, admin: user, tempPassword };
  } catch (err) {
    await prisma.inst.delete({ where: { id: instRow.id } });
    throw err;
  }
}

export async function updateInstitution(instId: string, data: Partial<CreateInstitutionInput>) {
  return prisma.inst.update({
    where: { id: instId },
    data: { ...data, updated_on: new Date() },
  });
}

export async function deleteInstitution(instId: string) {
  return prisma.inst.update({
    where: { id: instId },
    data: { is_archived: true, is_active: false, updated_on: new Date() },
  });
}