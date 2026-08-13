import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { roleScopeEnum } from "./enums";

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 50 })
    .notNull()
    .unique(),
  // SUPERADMIN | INSTADMIN | USER  (and future roles as new rows)

  scope: roleScopeEnum("scope").notNull(),
  // PLATFORM  -> SuperAdmin
  // INSTITUTE -> InstAdmin, User, (future: Teacher, Student)
});

// ─── TypeScript types ───────────────────────────────────────────
export type Role    = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;