import { Request, Response } from "express";
import { createInstitutionWithAdmin } from "./inst.service.js"; // Dev A's export
 
export async function createInstitutionController(req: Request, res: Response) {
  const { instData, adminPhoneNumber } = req.body;
  const result = await createInstitutionWithAdmin(instData, adminPhoneNumber);
  res.status(201).json(result);
}
