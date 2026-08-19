import { Request, Response } from "express";
import { createUser } from "./user.service.js";
 
const SUPPORTED_ROLES = ["ADMIN"] as const;         
const DEFERRED_ROLES = ["STUDENT", "TEACHER"];      
 
export async function createUserController(req: Request, res: Response) {
  const { phoneNumber, email, role } = req.body;
  const instId = req.user!.instId; // never trust instId from the request body
 
  if (DEFERRED_ROLES.includes(role)) {
    return res.status(400).json({
      error: `Role '${role}' is not supported yet`,
    });
  }
  if (!SUPPORTED_ROLES.includes(role)) {
    return res.status(400).json({ error: `Unsupported role: ${role}` });
  }
 
  const result = await createUser(instId, phoneNumber, role, email);
  res.status(201).json(result);
}
