import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/requirePermission.js";
import {
  createInstAdminController,
  updateInstAdminController,   
  deleteInstAdminController,   
} from "./inst-admin.controller.js";

const router = Router();

router.post("/admins", authenticate, requirePermission("admin:create"), createInstAdminController);
router.patch("/admins/:id", authenticate, requirePermission("admin:update"), updateInstAdminController); // ✅ new
router.delete("/admins/:id", authenticate, requirePermission("admin:delete"), deleteInstAdminController); // ✅ new

export default router;