import type { Request, Response, NextFunction } from "express";
import { subject as caslSubject } from "@casl/ability";
import type { Action, SubjectName } from "../casl/ability.types.js";
import { prisma } from "../db/client.js";

export function requireAbility(action: Action, subjectType: SubjectName) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let target: unknown = subjectType;

    if (subjectType === "User" && req.params.id) {
      const id = req.params.id;
      if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid user id" });
      }

      const row = await prisma.user.findUnique({ where: { id } });
      if (!row) return res.status(404).json({ error: "User not found" });

      // CASL conditions check `instId` (camelCase, per ability.types.ts),
      // but Prisma returns the raw `inst_id` column — map it explicitly.
      target = caslSubject("User", { ...row, instId: row.inst_id });
    }

    if (!req.ability?.can(action, target as any)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}