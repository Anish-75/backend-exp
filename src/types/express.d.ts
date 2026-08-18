import { AuthUser } from "./auth-user";
import { AppAbility } from "../casl/ability.types";
 
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      ability?: AppAbility;
    }
  }
}
 
export {};
