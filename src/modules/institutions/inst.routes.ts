import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/requirePermission.js";
import { createInstitutionController } from "./inst.controller.js";
 
const router = Router();
 
router.post("/institutions", authenticate, requirePermission("inst:create"), createInstitutionController);
 
export default router;
