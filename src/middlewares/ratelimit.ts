import { NextFunction, Request, Response } from "express";
import { getAuthHeader, getRequestIp } from "./util";
//import { RateWindowSize } from "./ratelimiter/rateLimiter";
import { redisRateLimiter } from "./ratelimiter/redis/redisRateLimiter";
import { RateWindowSize } from "./ratelimiter/rateLimiter";

type RateLimitKeyFn = (req: Request) => string | undefined;

/** create middleware to limit request rate */
export function createRateLimiter(
  keyFn: RateLimitKeyFn,
  rate: number,
  rateWindow: RateWindowSize = "hour",
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const key = keyFn(req);

    if (key == undefined) {
      return res.status(500); // TODO error handling
    }

    const result = await redisRateLimiter(key, rate, rateWindow);

    if (!result.limited) {
      return next();
    } else {
      return res.status(429).header(
        "Retry-After",
        result.remainingTimeInSecs.toString(),
      ).json({
        message:
          `Too Many Request. Try again in ${result.remainingTimeInSecs} seconds`,
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
