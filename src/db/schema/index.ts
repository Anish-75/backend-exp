export * from "./user.schema";
export * from "./inst.schema";
export * from "./roles.schema";
export * from "./permissions.schema";
export * from "./role-permissions.schema";

import { relations } from "drizzle-orm";
import { user } from "./user.schema";
import { inst } from "./inst.schema";
import { roles } from "./roles.schema";
import { permissions } from "./permissions.schema";
import { rolePermissions } from "./role-permissions.schema";

export const instRelations = relations(inst, ({ many, one }) => ({
  users: many(user),
  createdByUser: one(user, {
    fields: [inst.created_by],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ one }) => ({
  inst: one(inst, { fields: [user.inst_id], references: [inst.id] }),
  role: one(roles, { fields: [user.role_id], references: [roles.id] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  users: many(user),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.role_id],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permission_id],
      references: [permissions.id],
    }),
  }),
);
