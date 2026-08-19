import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/requirePermission.js";
import { createUserController } from "./user.controller.js";
 
const router = Router();
router.post("/users", authenticate, requirePermission("user:create"), createUserController);
 
export default router;
