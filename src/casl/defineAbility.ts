import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import type { AppAbility, Action, SubjectName } from "./ability.types.js";
import type { AuthUser } from "../types/auth-user.js";

export function defineAbilitiesFor(user: AuthUser): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  for (const permission of user.permissions) {
    const [resource, action] = permission.split(":");
    const subject = capitalize(resource) as SubjectName; // <-- SubjectName, not Subject

    if (subject === "User" && action === "update") {
      can("update", "User", { instId: user.instId });
    } else {
      can(action as Action, subject);
    }
  }

  return build();
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}