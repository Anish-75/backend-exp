import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { AppAbility, Action, Subject } from "./ability.types.js";
import { AuthUser } from "../types/auth-user.js";
 
export function defineAbilitiesFor(user: AuthUser): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
 
  for (const permission of user.permissions) {
    const [resource, action] = permission.split(":"); // e.g. 'inst:create'
    const subject = capitalize(resource) as Subject;
    can(action as Action, subject);
  }
 
  return build();
}
 
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
