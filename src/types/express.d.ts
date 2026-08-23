import { AuthUser } from "./auth-user.js";
import { AppAbility } from "../casl/ability.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      ability?: AppAbility;
    }
  }
}

export {};