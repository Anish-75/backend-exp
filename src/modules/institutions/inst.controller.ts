import { Request, Response } from "express";
import {
  createInstitutionWithAdmin,
  updateInstitution,
  deleteInstitution,
} from "./inst.service.js";
import { createInstAdmin } from "../inst-admin/inst-admin.service.js";
import { getRouteParam } from "../../utils/getRouteParam.js";

export async function createInstitutionController(req: Request, res: Response) {
  const { instData, adminData } = req.body;

  if (!adminData?.phoneNumber) {
    return res.status(400).json({ error: "adminData.phoneNumber is required" });
  }

  const result = await createInstitutionWithAdmin(
    instData,
    { phoneNumber: adminData.phoneNumber, name: adminData.name, email: adminData.email },
    req.user!.id // ✅ caller, never from body
  );
  res.status(201).json(result);
}

export async function updateInstitutionController(req: Request, res: Response) {
  const id = getRouteParam(req, "id");
  if (!id) return res.status(400).json({ error: "Invalid institution id" });

  const result = await updateInstitution(id, req.body, req.user!.id); 
  res.json(result);
}

export async function deleteInstitutionController(req: Request, res: Response) {
  const id = getRouteParam(req, "id");
  if (!id) return res.status(400).json({ error: "Invalid institution id" });

  const result = await deleteInstitution(id, req.user!.id); 
  res.json(result);
}

export async function replaceInstAdminController(req: Request, res: Response) {
  const instId = getRouteParam(req, "id");
  if (!instId) return res.status(400).json({ error: "Invalid institution id" });

  const { phoneNumber, name, email } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: "phoneNumber is required" });

  const result = await createInstAdmin(instId, { phoneNumber, name, email }, req.user!.id); 
  res.status(201).json(result);
}