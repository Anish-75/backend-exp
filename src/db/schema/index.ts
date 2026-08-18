import { relations } from "drizzle-orm";
import { user } from "./user.schema.js";
import { inst } from "./inst.schema.js";
import { roles } from "./roles.schema.js";
import { permissions } from "./permissions.schema.js";
import { rolePermissions } from "./role-permissions.schema.js";
export * from "./user.schema.js";
export * from "./inst.schema.js";
export * from "./roles.schema.js";
export * from "./permissions.schema.js";
export * from "./role-permissions.schema.js";
export {
  user as authUser,
  session,
  account,
  verification,
  userRelations as authUserRelations,
  sessionRelations,
  accountRelations,
} from "./auth-schema.js";

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
