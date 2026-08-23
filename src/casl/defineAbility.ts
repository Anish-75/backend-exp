import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import type { AppAbility, Action, SubjectName } from "./ability.types.js";
import type { AuthUser } from "../types/auth-user.js";

// Actions on "User" that must always be scoped to the caller's institute.
const INST_SCOPED_USER_ACTIONS: Action[] = ["update", "delete"]; 

export function defineAbilitiesFor(user: AuthUser): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  for (const permission of user.permissions) {
    const [resource, action] = permission.split(":");
    const subject = capitalize(resource) as SubjectName;

    if (subject === "User" && INST_SCOPED_USER_ACTIONS.includes(action as Action)) {
      can(action as Action, "User", { instId: user.instId });
    } else {
      can(action as Action, subject);
    }
  }

  return build();
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}