import type { Request, Response } from "express";
import { auth } from "../../lib/auth.js";
import { setNewPassword } from "../users/user.service.js";
 
export async function setNewPasswordController(req: Request, res: Response) {
  if (!req.user!.isTempPassword) {
    return res.status(400).json({ error: "Password reset not required" });
  }
 
  const { current_password, new_password, confirm_new_password } = req.body;
 
  if (new_password !== confirm_new_password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  if (new_password === current_password) {
    return res.status(400).json({ error: "New password must differ from current password" });
  }
 
  try {
    // Real session headers forwarded here — this is the ONLY changePassword call.
    await auth.api.changePassword({
      body: { currentPassword: current_password, newPassword: new_password },
      headers: req.headers as any,
    });
  } catch {
    return res.status(400).json({ error: "Current password is incorrect" });
  }
 
  const updated = await setNewPassword(req.user!.id);
  res.json({ user: updated });
}
