// src/db/client.ts
import { PrismaPg } from "@prisma/adapter-pg";
// The generated Prisma client is outside `src`, so TypeScript reports it as
// being outside the configured `rootDir` even though the runtime import is valid.
// @ts-ignore -- generated client location is controlled by Prisma.
import { PrismaClient } from "../../generated/prisma/client.js";
import { env } from "../config/env.js";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

export async function closePool() {
  await prisma.$disconnect();
}