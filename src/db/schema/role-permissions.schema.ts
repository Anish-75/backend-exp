import { pgTable, uuid, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { roles } from "./roles.schema.js";
import { permissions } from "./permissions.schema.js";

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdOn: timestamp("created_on").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  }),
);
