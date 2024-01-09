import { NextFunction, Request, Response } from "express";
import { getAuthHeader } from "./util";
import { config } from "../config";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = getAuthHeader(req) || "";
  const userIsAuthenticated = authHeader === `Bearer ${config.SECRET_TOKEN}`;

  if (userIsAuthenticated) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
