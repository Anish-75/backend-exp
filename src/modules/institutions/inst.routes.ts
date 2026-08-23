import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/requirePermission.js";
import {
  createInstitutionController,
  updateInstitutionController,
  deleteInstitutionController,
  replaceInstAdminController,
} from "./inst.controller.js";

const router = Router();

router.post("/institutions", authenticate, requirePermission("inst:create"), createInstitutionController);
router.patch("/institutions/:id", authenticate, requirePermission("inst:update"), updateInstitutionController);
router.delete("/institutions/:id", authenticate, requirePermission("inst:delete"), deleteInstitutionController);

router.post(
  "/institutions/:id/admin",
  authenticate,
  requirePermission("admin:create"),
  replaceInstAdminController
);

export default router;