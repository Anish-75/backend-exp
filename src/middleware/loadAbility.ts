import { Request, Response, NextFunction } from "express";
import { defineAbilitiesFor } from "../casl/defineAbility.js";
 
export function loadAbility(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.ability = defineAbilitiesFor(req.user);
  next();
}
