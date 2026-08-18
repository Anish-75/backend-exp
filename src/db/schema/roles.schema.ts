import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  boolean,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const roleScopeEnum = pgEnum("role_scope", ["PLATFORM", "INSTITUTE"]);

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  is_active: boolean("is_active").notNull().default(true),
  is_archived: boolean("is_archived").notNull().default(false),
  created_on: timestamp("created_on", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_on: timestamp("updated_on", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
