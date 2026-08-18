import { relations } from "drizzle-orm";
import { inst } from "./inst.schema";
import { roles } from "./roles.schema";
import { permissions } from "./permissions.schema";
import { rolePermissions } from "./role-permissions.schema";
export * from "./inst.schema";
export * from "./roles.schema";
export * from "./permissions.schema";
export * from "./role-permissions.schema";
export {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
} from "./auth-schema";



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
