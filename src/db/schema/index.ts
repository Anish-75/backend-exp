import { relations } from "drizzle-orm";
import { inst } from "./inst.schema.js";
import { roles } from "./roles.schema.js";
import { permissions } from "./permissions.schema.js";
import { rolePermissions } from "./role-permissions.schema.js";
export * from "./inst.schema.js";
export * from "./roles.schema.js";
export * from "./permissions.schema.js";
export * from "./role-permissions.schema.js";
export {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
} from "./auth-schema.js";

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));
