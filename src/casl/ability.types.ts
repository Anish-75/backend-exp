import type { MongoAbility, ForcedSubject } from "@casl/ability";

export type Action = "create" | "read" | "update" | "delete" | "manage";

// Plain subject names — used for actions/permission strings.
export type SubjectName = "Inst" | "User" | "Role" | "Assignment";

// The "User" name additionally carries a tagged, field-typed shape so
// conditions like { instId: ... } type-check against real fields.
type UserRecord = { id: string; instId: string } & ForcedSubject<"User">;

export type Subject = SubjectName | "all" | UserRecord;

export type AppAbility = MongoAbility<[Action, Subject]>;