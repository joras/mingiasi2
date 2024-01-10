import express from "express";
import { config } from "../config";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createSecretTokenRateLimiter } from "../middlewares/ratelimit";
import { RateWindowSize } from "../middlewares/ratelimiter/types";

export const privateRoutes = express.Router();
privateRoutes.use(isAuthenticated);
privateRoutes.use(
  createSecretTokenRateLimiter(
    config.RATE_PRIVATE,
    config.RATE_WINDOW as RateWindowSize,
  ),
);

privateRoutes.get("/hello", (req, res) => {
  res.send("Hello my my friend!");
});

privateRoutes.get("/price", (req, res) => {
  res.send("5$ Special price for you, my friend!");
});
