import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../db/client.js";

const ALLOWED_WHILE_TEMP = new Set(["GET /me", "POST /set-new-password"]);

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: req.headers as any });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { user } = session;

  if (user.is_active === false || user.is_archived === true) {
    return res.status(401).json({ error: "Account is inactive or archived" });
  }

  const [grants, role] = await Promise.all([
    prisma.role_permissions.findMany({
      where: { role_id: user.role_id },
      include: { permissions: true },
    }),
    prisma.roles.findUnique({ where: { id: user.role_id } }), 
  ]);

  req.user = {
    id: user.id,
    instId: user.inst_id,
    roleId: user.role_id,
    roleName: role?.name ?? "", 
    permissions: grants.map((g) => g.permissions.name),
    isTempPassword: user.is_temp_password,
  };

  if (req.user.isTempPassword) {
    const key = `${req.method} ${req.path}`;
    if (!ALLOWED_WHILE_TEMP.has(key)) {
      return res.status(403).json({ error: "Password reset required before continuing" });
    }
  }

  next();
}