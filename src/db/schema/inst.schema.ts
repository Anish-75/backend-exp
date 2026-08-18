import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const inst = pgTable("inst", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  contact_phone: varchar("contact_phone", { length: 10 })
    .notNull()
    .unique()
    .default("0000000000"),
  contact_email: varchar("contact_email", { length: 255 }),
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
