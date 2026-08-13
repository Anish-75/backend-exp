import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
  } from "drizzle-orm/pg-core";
  import { users } from "./users";
  
  export const refreshTokens = pgTable("refresh_tokens", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // cascade: if user deleted, all their refresh tokens are deleted too
  
    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    // Raw token is NEVER stored — only the hash
    // Same idea as storing password hashes
  
    expiresAt: timestamp("expires_at").notNull(),
  
    revoked: boolean("revoked").notNull().default(false),
    // false = valid token
    // true  = logged out or force-revoked (e.g. InstAdmin deleted this User)
  
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  // ─── TypeScript types ───────────────────────────────────────────
  export type RefreshToken    = typeof refreshTokens.$inferSelect;
  export type NewRefreshToken = typeof refreshTokens.$inferInsert;