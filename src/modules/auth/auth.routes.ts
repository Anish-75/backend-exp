import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../lib/auth.js";
import { authenticate } from "../../middleware/authenticate.js";
import { setNewPasswordController } from "./auth.controller.js";

const router = Router();

// Better Auth's own endpoints: POST /sign-in, /sign-out, session refresh, etc.
router.all("/api/auth/*splat", toNodeHandler(auth));

router.post("/set-new-password", authenticate, setNewPasswordController);

export default router;
