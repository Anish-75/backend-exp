import { eq, and, lt } from "drizzle-orm";
import { db } from "../index";
import {
  refreshTokens,
  RefreshToken,
  NewRefreshToken,
} from "../schema";
import crypto from "crypto";

// Hash token before storing (same principle as password hashing)
export function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// SAVE new refresh token
export async function saveRefreshToken(
  data: NewRefreshToken
): Promise<RefreshToken> {
  const [token] = await db
    .insert(refreshTokens)
    .values(data)
    .returning();
  return token;
}

// FIND refresh token by hash (for validation)
export async function getRefreshToken(
  rawToken: string
): Promise<RefreshToken | undefined> {
  const hash = hashToken(rawToken);

  const result = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.tokenHash, hash),
        eq(refreshTokens.revoked, false)
      )
    )
    .limit(1);
  return result[0];
}

// REVOKE a specific token (logout)
export async function revokeRefreshToken(
  rawToken: string
): Promise<boolean> {
  const hash = hashToken(rawToken);

  const [revoked] = await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.tokenHash, hash))
    .returning();
  return !!revoked;
}

// REVOKE ALL tokens for a user
// (Used when: InstAdmin deletes a User, forced logout)
export async function revokeAllUserTokens(
  userId: string
): Promise<void> {
  await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(
      and(
        eq(refreshTokens.userId, userId),
        eq(refreshTokens.revoked, false)
      )
    );
}

// CLEANUP expired tokens (run as a scheduled job)
export async function deleteExpiredTokens(): Promise<void> {
  await db
    .delete(refreshTokens)
    .where(lt(refreshTokens.expiresAt, new Date()));
}