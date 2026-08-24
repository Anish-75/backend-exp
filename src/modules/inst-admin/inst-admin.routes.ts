import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/requirePermission.js";
import {
  updateInstAdminController,   
  deleteInstAdminController,   
} from "./inst-admin.controller.js";

const router = Router();

router.patch("/admins/:id", authenticate, requirePermission("admin:update"), updateInstAdminController); 
router.delete("/admins/:id", authenticate, requirePermission("admin:delete"), deleteInstAdminController); 

export default router;