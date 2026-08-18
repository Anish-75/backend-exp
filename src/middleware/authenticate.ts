import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { db } from "../db/client.js";
import { roles, rolePermissions, permissions } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
 
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: req.headers as any });
 
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
 
  const { user } = session;
 
  if (user.is_active === false || user.is_archived === true) {
    return res.status(401).json({ error: "Account is inactive or archived" });
  }
 
  const perms = await db
    .select({ name: permissions.name })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, user.role_id));
 
  req.user = {
    id: user.id,
    instId: user.inst_id,
    roleId: user.role_id,
    permissions: perms.map((p) => p.name),
    isTempPassword: user.is_temp_password,
  };
 
  next();
}
