import { Request, Response } from "express";
import { createInstAdmin } from "./inst-admin.service.js";
 
export async function createInstAdminController(req: Request, res: Response) {
  const { instId, phoneNumber } = req.body;
  const result = await createInstAdmin(instId, phoneNumber);
  res.status(201).json(result);
}
