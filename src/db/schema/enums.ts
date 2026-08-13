import { pgEnum } from "drizzle-orm/pg-core";

// Used in institutions table
export const institutionStatusEnum = pgEnum("institution_status", [
  "ACTIVE",
  "INACTIVE",
  "DELETED",
]);

// Used in users table
export const userStatusEnum = pgEnum("user_status", [
  "ACTIVE",
  "INACTIVE",
  "DELETED",
]);

// Used in roles table
export const roleScopeEnum = pgEnum("role_scope", [
  "PLATFORM",
  "INSTITUTE",
]);