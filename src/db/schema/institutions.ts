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
    // Short unique code for the institution e.g. "MIT-001"
  
    name: varchar("name", { length: 255 }).notNull(),
  
    address: text("address"),
  
    contactPhone: varchar("contact_phone", { length: 20 }),
    // This phone number becomes the InstAdmin's login phone_number
  
    contactEmail: varchar("contact_email", { length: 255 }),
  
    // FK to users.id — who created this institution (SuperAdmin)
    // NULL initially because user row doesn't exist yet at DB level
    // We set this after both rows are created
    createdBy: uuid("created_by"),
    // .references(() => users.id) — added after users table exists
    // We handle this as a deferred FK in migration or just app-level
  
    status: institutionStatusEnum("status").notNull().default("ACTIVE"),
  
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  
  // ─── TypeScript types ───────────────────────────────────────────
  export type Institution    = typeof institutions.$inferSelect;
  export type NewInstitution = typeof institutions.$inferInsert;