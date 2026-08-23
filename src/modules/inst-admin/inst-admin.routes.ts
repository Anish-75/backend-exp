import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/requirePermission.js";
import { createInstAdminController } from "./inst-admin.controller.js";

const router = Router();
router.post("/admins", authenticate, requirePermission("admin:create"), createInstAdminController); // ✅ was "user:create"

export default router;