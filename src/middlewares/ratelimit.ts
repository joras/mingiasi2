import { NextFunction, Request, Response } from "express";
import { getAuthHeader, getRequestIp } from "./util";
import { redisRateLimiter } from "./ratelimiter/redis/redisRateLimiter";
import { RateLimitFn, RateWindowSize } from "./ratelimiter/types";

type RateLimitKeyFn = (req: Request) => string | undefined;

/** create middleware to limit request rate */
export function createRateLimiter(
  keyFn: RateLimitKeyFn,
  rate: number,
  rateWindow: RateWindowSize = "hour",
  rateLimiter: RateLimitFn = redisRateLimiter,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = keyFn(req);

    if (key == undefined) {
      throw new Error("unexpected error");
    }

    const result = await rateLimiter(key, rate, rateWindow);

    if (!result.limited) {
      return next();
    } else {
      return res
        .status(429)
        .header("Retry-After", result.remainingTimeInSecs.toString())
        .json({
          message: `Too Many Request. Try again in ${result.remainingTimeInSecs} seconds`,
          limit: rate,
          limitWindow: rateWindow,
        });
    }
  };
}

/** create middleware to limit request rate based on clients secret token */
export function createSecretTokenRateLimiter(
  rate: number,
  rateWindow: RateWindowSize = "hour",
) {
  return createRateLimiter(getAuthHeader, rate, rateWindow);
}

/** create middleware to limit request rate based on clients IP */
export function createIPRateLimiter(
  rate: number,
  rateWindow: RateWindowSize = "hour",
) {
  return createRateLimiter(getRequestIp, rate, rateWindow);
}
