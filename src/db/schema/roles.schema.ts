import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  boolean,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const roleScopeEnum = pgEnum("role_scope", ["PLATFORM", "INSTITUTE"]);

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  scope: roleScopeEnum("scope").notNull(),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedOn: timestamp("updated_on").defaultNow().notNull(),
  updatedBy: uuid("updated_by"),
  isActive: boolean("is_active").default(true).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
});
