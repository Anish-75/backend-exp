import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g. inst:create, user:delete

  created_by: uuid("created_by").references((): AnyPgColumn => user.id),
  updated_by: uuid("updated_by").references((): AnyPgColumn => user.id),
  is_active: boolean("is_active").notNull().default(true),
  is_archived: boolean("is_archived").notNull().default(false),
  created_on: timestamp("created_on", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_on: timestamp("updated_on", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
