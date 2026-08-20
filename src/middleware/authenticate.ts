
import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../db/client.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: req.headers as any });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { user } = session;

  if (user.is_active === false || user.is_archived === true) {
    return res.status(401).json({ error: "Account is inactive or archived" });
  }

  const rolePerms = await prisma.role_permissions.findMany({
    where: { role_id: user.role_id },
    include: { permissions: { select: { name: true } } },
  });

  req.user = {
    id: user.id,
    instId: user.inst_id,
    roleId: user.role_id,
    permissions: rolePerms.map((rp) => rp.permissions.name),
    isTempPassword: user.is_temp_password,
  };

  next();
}