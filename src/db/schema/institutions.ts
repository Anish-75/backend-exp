import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
  } from "drizzle-orm/pg-core";
  import { institutionStatusEnum } from "./enums";
  export const institutions = pgTable("institutions", {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 50 })
      .notNull()
      .unique(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address"),
    contactPhone: varchar("contact_phone", { length: 20 }),
    contactEmail: varchar("contact_email", { length: 255 }),
    createdBy: uuid("created_by"),
    status: institutionStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  export type Institution    = typeof institutions.$inferSelect;
  export type NewInstitution = typeof institutions.$inferInsert;