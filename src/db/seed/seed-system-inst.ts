import { prisma } from "../client.js";

export async function seedSystemInst() {
  return prisma.inst.upsert({
    where: { code: "SYS" },
    update: {},
    create: {
      code: "SYS",
      name: "System",
      phone_number: "0000000000",
    },
  });
}