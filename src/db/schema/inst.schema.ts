import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema.js";

export const inst = pgTable("inst", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  contactPhone: varchar("contact_phone", { length: 10 })
    .notNull()
    .unique()
    .default("0000000000"),
  contactEmail: varchar("contact_email", { length: 255 }),
  createdBy: uuid("created_by").references((): AnyPgColumn => user.id),
  updatedBy: uuid("updated_by").references((): AnyPgColumn => user.id),
  isActive: boolean("is_active").notNull().default(true),
  isArchived: boolean("is_archived").notNull().default(false),
  createdOn: timestamp("created_on", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedOn: timestamp("updated_on", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
