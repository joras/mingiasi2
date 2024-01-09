import { NextFunction, Request, Response } from "express";
import config from "../config.json";
import { getAuthHeader } from "./util";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = getAuthHeader(req) || "";
  const userIsAuthenticated = authHeader === `Bearer ${config.token}`;

  if (userIsAuthenticated) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
