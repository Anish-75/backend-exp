import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 })
    .notNull()
    .unique(),
});

// ─── TypeScript types ───────────────────────────────────────────
export type Permission    = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;