import type { Request } from "express";
export function getRouteParam(req: Request, name: string): string | null {
  const value = req.params[name];
  if (typeof value !== "string") return null;
  return value;
}