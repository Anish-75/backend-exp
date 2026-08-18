import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import { authenticate } from "./middleware/authenticate.js";
import { loadAbility } from "./middleware/loadAbility.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
 
app.use(authRoutes);
 
app.get("/me", authenticate, loadAbility, (req, res) => {
  res.json({ user: req.user });
});

export default app;
