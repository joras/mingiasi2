import express from "express";
import { config } from "../config";
import { createIPRateLimiter } from "../middlewares/ratelimit";
import { RateWindowSize } from "../middlewares/ratelimiter/rateLimiter";

export const publicRoutes = express.Router();
publicRoutes.use(
  createIPRateLimiter(
    config.RATE_PUBLIC,
    config.RATE_WINDOW as RateWindowSize,
  ),
);

publicRoutes.get("/hello", (_req, res) => {
  res.send("Hi!");
});

publicRoutes.get("/price", (_req, res) => {
  res.send("999$");
});
