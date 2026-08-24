import { Request, Response } from "express";
import { updateInstAdmin, deleteInstAdmin } from "./inst-admin.service.js";
import { getRouteParam } from "../../utils/getRouteParam.js";

export async function updateInstAdminController(req: Request, res: Response) {
  const id = getRouteParam(req, "id");
  if (!id) return res.status(400).json({ error: "Invalid admin id" });

  const { name, email, instId } = req.body;
  if (!instId) return res.status(400).json({ error: "instId is required to scope the update" });

  const result = await updateInstAdmin(instId, id, { name, email }, req.user!.id); 
  res.json(result);
}

export async function deleteInstAdminController(req: Request, res: Response) {
  const id = getRouteParam(req, "id");
  if (!id) return res.status(400).json({ error: "Invalid admin id" });

  const { instId } = req.body;
  if (!instId) return res.status(400).json({ error: "instId is required to scope the delete" });

  const result = await deleteInstAdmin(req.user!.roleName, id, instId, req.user!.id); 
  res.json(result);
}