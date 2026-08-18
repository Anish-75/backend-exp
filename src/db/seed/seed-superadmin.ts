import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { db } from "../client";
import { user, roles } from "../schema";
import { eq } from "drizzle-orm";

// --- Inline password helpers (temporary, only for seeding) ---
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%^&*";
const ALL = UPPER + LOWER + DIGITS + SYMBOLS;

function randomChar(set: string) {
  const idx = crypto.randomInt(0, set.length);
  return set[idx];
}

function generateTempPassword(length = 8): string {
  const required = [
    randomChar(UPPER),
    randomChar(LOWER),
    randomChar(DIGITS),
    randomChar(SYMBOLS),
  ];
  const rest = Array.from({ length: length - required.length }, () =>
    randomChar(ALL),
  );
  const chars = [...required, ...rest];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function seedSuperAdmin(systemInstId: string) {
  const phone = process.env.SUPERADMIN_PHONE!;

  // Check if already exists
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.phone_number, phone));
  if (existing.length) {
    console.log("ℹ️  SuperAdmin already exists");
    return existing[0];
  }

  const [superAdminRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "SUPERADMIN"));
  if (!superAdminRole)
    throw new Error("SUPERADMIN role not seeded yet — run role seed first");

  const plainPassword = generateTempPassword();
  const hashed = await hashPassword(plainPassword);

  const [superAdmin] = await db
    .insert(user)
    .values({
      inst_id: systemInstId,
      phone_number: phone,
      password: hashed,
      role_id: superAdminRole.id,
      is_temp_password: true,
    })
    .returning();

  console.log("✅ SuperAdmin created:", superAdmin.phone_number);
  console.log(
    "🔑 Temp password (save this now, shown only once):",
    plainPassword,
  );
  return superAdmin;
}
