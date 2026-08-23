import { Request, Response } from "express";
import { createUser, updateUser, deleteUser } from "./user.service.js";
import { getRouteParam } from "../../utils/getRouteParam.js"; 

const SUPPORTED_ROLES = ["ADMIN"] as const;
const DEFERRED_ROLES = ["STUDENT", "TEACHER"];

export async function createUserController(req: Request, res: Response) {
  const { phoneNumber, email, role, name } = req.body;
  const instId = req.user!.instId;

  if (DEFERRED_ROLES.includes(role)) {
    return res.status(400).json({ error: `Role '${role}' is not supported yet` });
  }
  if (!SUPPORTED_ROLES.includes(role)) {
    return res.status(400).json({ error: `Unsupported role: ${role}` });
  }

  const result = await createUser(instId, phoneNumber, role, email, name);
  res.status(201).json(result);
}

export async function updateUserController(req: Request, res: Response) {
  const id = getRouteParam(req, "id"); 
  if (!id) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const { name, email } = req.body;
  const instId = req.user!.instId;

  const result = await updateUser(instId, id, { name, email });
  res.json(result);
}

export async function deleteUserController(req: Request, res: Response) {
  const id = getRouteParam(req, "id"); 
  if (!id) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const instId = req.user!.instId;

  const result = await deleteUser(instId, id);
  res.json(result);
}