import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedOn: timestamp("updated_on").defaultNow().notNull(),
  updatedBy: uuid("updated_by"),
  isActive: boolean("is_active").default(true).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
});
