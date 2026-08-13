import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 })
    .notNull()
    .unique(),
  /*
    Current permission names:
      inst:create       inst:update       inst:delete
      instadmin:create  instadmin:update  instadmin:delete
      user:create       user:update       user:delete
      password:reset                                        <- self-service
  */
});

// ─── TypeScript types ───────────────────────────────────────────
export type Permission    = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;