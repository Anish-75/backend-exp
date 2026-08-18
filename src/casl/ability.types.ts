import { MongoAbility } from "@casl/ability";
 
export type Action = "create" | "read" | "update" | "delete" | "manage";
export type Subject = "Inst" | "User" | "Role" | "Assignment" | "all";
 
export type AppAbility = MongoAbility<[Action, Subject]>;
