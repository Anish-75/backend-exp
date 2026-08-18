import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../lib/auth.js";
//import { setNewPasswordController } from "./auth.controller";
//import { authenticate } from "../../middleware/authenticate";
 
const router = Router();
 
// Better Auth's own endpoints: POST /sign-in, /sign-out, session refresh, etc.
router.all("/api/auth/*splat", toNodeHandler(auth));
 
// Our one custom endpoint
//router.post("/set-new-password", authenticate, setNewPasswordController);
 
export default router;
