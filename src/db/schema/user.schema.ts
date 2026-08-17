import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { inst } from "./inst.schema";
import { roles } from "./roles.schema";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  inst_id: uuid("inst_id")
    .notNull()
    .references((): AnyPgColumn => inst.id),
  phone_number: varchar("phone_number", { length: 20 })
    .notNull()
    .unique()
    .default("000000000"),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  role_id: uuid("role_id")
    .notNull()
    .references((): AnyPgColumn => roles.id),
  is_temp_password: boolean("is_temp_password").notNull().default(true),
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
