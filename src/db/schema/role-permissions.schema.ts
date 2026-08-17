import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { roles } from './roles.schema';
import { permissions } from './permissions.schema';

export const rolePermissions = pgTable(
  'role_permissions',
  {
    role_id: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
    permission_id: uuid('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
    created_on: timestamp('created_on', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.role_id, table.permission_id] }),
  }),
);