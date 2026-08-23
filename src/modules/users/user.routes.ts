import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { loadAbility } from "../../middleware/loadAbility.js";       
import { requirePermission } from "../../middleware/requirePermission.js";
import { requireAbility } from "../../middleware/requireAbility.js"; 
import {
  createUserController,
  updateUserController,  
  deleteUserController,   
} from "./user.controller.js";

const router = Router();

router.post("/users", authenticate, requirePermission("user:create"), createUserController);

router.patch(
  "/users/:id",
  authenticate,
  loadAbility,
  requirePermission("user:update"),
  requireAbility("update", "User"),
  updateUserController
);

router.delete(
  "/users/:id",
  authenticate,
  loadAbility,
  requirePermission("user:delete"),
  requireAbility("delete", "User"),
  deleteUserController
);

export default router;