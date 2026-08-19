import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import { authenticate } from "./middleware/authenticate.js";
import { loadAbility } from "./middleware/loadAbility.js";
import instRoutes from "./modules/institutions/inst.routes.js";
import instAdminRoutes from "./modules/inst-admin/inst-admin.routes.js";
import userRoutes from "./modules/users/user.routes.js";


const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
 
app.use(authRoutes);
 
app.get("/me", authenticate, loadAbility, (req, res) => {
  res.json({ user: req.user });
});

app.use(instRoutes);
app.use(instAdminRoutes);
app.use(userRoutes);


export default app;
