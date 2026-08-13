import { eq, and, ne } from "drizzle-orm";
import { db } from "../index";
import {
  users,
  roles,
  permissions,
  rolePermissions,
  User,
  NewUser,
  SafeUser,
} from "../schema";

// ─── Helpers ────────────────────────────────────────────────────

// Strip password before returning to API layer
function toSafeUser(user: User): SafeUser {
  const { password: _password, ...safe } = user;
  return safe;
}

// ─── Queries ────────────────────────────────────────────────────

// GET user by ID (includes password — for internal use only)
export async function getUserById(
  id: string
): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.id, id),
        ne(users.status, "DELETED")
      )
    )
    .limit(1);
  return result[0];
}

// GET user by phone number (for login — needs password)
export async function getUserByPhone(
  phoneNumber: string
): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.phoneNumber, phoneNumber))
    .limit(1);
  return result[0];
}

// GET all users within an institution (InstAdmin use)
export async function getUsersByInstitution(
  instId: string
): Promise<SafeUser[]> {
  const result = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.instId, instId),
        ne(users.status, "DELETED")
      )
    );
  return result.map(toSafeUser);
}

// GET user with their role and permissions (for JWT payload building)
export async function getUserWithPermissions(userId: string): Promise<{
  user: User;
  roleName: string;
  permissions: string[];
} | null> {
  // Get user with role
  const userResult = await db
    .select({
      user:     users,
      roleName: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, userId))
    .limit(1);

  if (userResult.length === 0) return null;

  const { user, roleName } = userResult[0];

  // Get permissions for this role
  const permsResult = await db
    .select({ name: permissions.name })
    .from(rolePermissions)
    .innerJoin(
      permissions,
      eq(rolePermissions.permissionId, permissions.id)
    )
    .where(eq(rolePermissions.roleId, user.roleId));

  return {
    user,
    roleName,
    permissions: permsResult.map((p) => p.name),
  };
}

// CREATE user
export async function createUser(data: NewUser): Promise<User> {
  const [user] = await db
    .insert(users)
    .values(data)
    .returning();
  return user;
}

// UPDATE user (general — for status, role changes)
export async function updateUser(
  id: string,
  data: Partial<NewUser>
): Promise<User | undefined> {
  const [updated] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(
        eq(users.id, id),
        ne(users.status, "DELETED")
      )
    )
    .returning();
  return updated;
}

// UPDATE password (also resets isTempPassword flag)
export async function updateUserPassword(
  id: string,
  newHashedPassword: string,
  isTempPassword: boolean = false
): Promise<boolean> {
  const [updated] = await db
    .update(users)
    .set({
      password:       newHashedPassword,
      isTempPassword: isTempPassword,
      updatedAt:      new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return !!updated;
}

// SOFT DELETE user (set status = DELETED)
export async function deleteUser(
  id: string,
  instId: string  // Safety: InstAdmin can only delete users in their inst
): Promise<boolean> {
  const [deleted] = await db
    .update(users)
    .set({ status: "DELETED", updatedAt: new Date() })
    .where(
      and(
        eq(users.id, id),
        eq(users.instId, instId)  // Scoped to institution
      )
    )
    .returning();
  return !!deleted;
}

// CHECK if phone number already exists (before creating user)
export async function isPhoneNumberTaken(
  phoneNumber: string
): Promise<boolean> {
  const result = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.phoneNumber, phoneNumber))
    .limit(1);
  return result.length > 0;
}