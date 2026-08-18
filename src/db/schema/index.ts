import { relations } from "drizzle-orm";
import { user } from "./user.schema";
import { inst } from "./inst.schema";
import { roles } from "./roles.schema";
import { permissions } from "./permissions.schema";
import { rolePermissions } from "./role-permissions.schema";
export * from "./user.schema";
export * from "./inst.schema";
export * from "./roles.schema";
export * from "./permissions.schema";
export * from "./role-permissions.schema";
export {
  user as authUser,
  session,
  account,
  verification,
  userRelations as authUserRelations,
  sessionRelations,
  accountRelations,
} from "./auth-schema";

export const userRelations = relations(user, ({ one }) => ({
  inst: one(inst, { fields: [user.inst_id], references: [inst.id] }),
  role: one(roles, { fields: [user.role_id], references: [roles.id] }),
}));

export const instRelations = relations(inst, ({ many }) => ({
  users: many(user),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(user),
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
