import { Redis } from "ioredis";
import { RateLimitFn, RateWindowSize } from "../types";
import { INCREMENT_RATE_KEY_LUA_FN } from "./luaScripts";
import { config } from "../../../config";

type ExtendedRedis = Redis & {
  incrementRateLimitKey(key: string, ttl: number): Promise<unknown>;
};

let redis: ExtendedRedis | undefined = undefined;

function getRedisClient() {
  if (redis !== undefined) {
    return redis;
  }

  redis = new Redis(config.REDIS_URL) as ExtendedRedis;

  redis.defineCommand("incrementRateLimiter", {
    lua: INCREMENT_RATE_KEY_LUA_FN,
    numberOfKeys: 1,
  });

  return redis;
}

/**
 * Fixed window rate limiter based on Redis
 */
export const redisRateLimiter: RateLimitFn = async (
  key: string,
  rate: number,
  rateWindow: RateWindowSize,
) => {
  const redisClient = getRedisClient();
  const ttl = getUnitInSeconds(rateWindow);
  const fullKey = `rate_limit:${rateWindow}:${key}`;

  const result = handleScriptResult(
    await redisClient.incrementRateLimitKey(fullKey, ttl),
  );

  if (result == undefined) {
    throw new Error("cannot call redis");
  }

  return {
    limited: result?.requests > rate,
    remainingRequests: rate - result?.requests,
    remainingTimeInSecs: result.ttlSec,
  };
};

function handleScriptResult(luaIncrFnResult: unknown) {
  if (
    Array.isArray(luaIncrFnResult) &&
    luaIncrFnResult.length === 2 &&
    typeof luaIncrFnResult[0] === "number" &&
    typeof luaIncrFnResult[1] === "number"
  ) {
    return {
      requests: luaIncrFnResult[0],
      ttlSec: Math.ceil(luaIncrFnResult[1] / 1000),
    };
  }
}

function getUnitInSeconds(unit: RateWindowSize) {
  switch (unit) {
    case "second":
      return 1;
    case "minute":
      return 60;
    case "hour":
      return 60 * 60;
  }
}
