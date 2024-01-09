import { NextFunction, Request, Response } from "express";
import config from "../config.json";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization || "";
  const userIsAuthenticated = authHeader === `Bearer ${config.token}`;

  if (userIsAuthenticated) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
