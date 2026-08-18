import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const inst = pgTable("inst", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  contactPhone: varchar("contact_phone", { length: 20 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedOn: timestamp("updated_on").defaultNow().notNull(),
  updatedBy: uuid("updated_by"),
  isActive: boolean("is_active").default(true).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
});
