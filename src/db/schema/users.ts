import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
  } from "drizzle-orm/pg-core";
  import { institutions } from "./institutions";
  import { roles } from "./roles";
  import { userStatusEnum } from "./enums";
  
  export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    instId: uuid("inst_id")
      .notNull()
      .references(() => institutions.id, { onDelete: "restrict" }),
    // Every user (including SuperAdmin) belongs to an institution
    // SuperAdmin belongs to a special "PLATFORM" institution created in seed
  
    phoneNumber: varchar("phone_number", { length: 20 })
      .notNull()
      .unique(),
    // Globally unique — this is the login identifier for ALL roles
  
    password: varchar("password", { length: 255 }).notNull(),
    // Always stored as bcrypt hash — plain text NEVER stored
  
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
  
    isTempPassword: boolean("is_temp_password").notNull().default(true),
    // true  = system-generated password, force reset on login (for SUPERADMIN/INSTADMIN)
    // false = user has set their own password
  
    status: userStatusEnum("status").notNull().default("ACTIVE"),
  
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  
  // ─── TypeScript types ───────────────────────────────────────────
  export type User    = typeof users.$inferSelect;
  export type NewUser = typeof users.$inferInsert;
  
  // Safe type — never expose password field to API responses
  export type SafeUser = Omit<User, "password">;