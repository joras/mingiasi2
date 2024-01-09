import { Redis } from "ioredis";
import { RateLimitFn, RateWindowSize } from "../rateLimiter";
import { INCREMENT_RATE_KEY_LUA_FN } from "./luaScripts";

let redis: Redis | undefined = undefined;

function getRedisClient() {
  if (redis !== undefined) {
    return redis;
  }

  redis = new Redis();
  return redis;
}

/**
 * Fixed window rate limiter based on Redis
 */
export const redisRateLimiter: RateLimitFn = async (
  key: string,
  rate: number,
  rateWindow: "second" | "minute" | "hour",
) => {
  const redisClient = getRedisClient(); // TODO handle errors
  const ttl = getUnitInSeconds(rateWindow);
  const fullKey = `rate_limit:${rateWindow}:${key}`;

  const result = handleScriptResult(
    await redisClient.eval(
      INCREMENT_RATE_KEY_LUA_FN,
      1,
      fullKey,
      ttl,
    ),
  );

  if (result == undefined) {
    throw "unexpected"; //TODO
  }

  return {
    limited: result?.requests > rate,
    remainingRequests: rate - result?.requests,
    remainingTimeInSecs: ttl,
  };
};

function handleScriptResult(luaIncrFnResult: unknown) {
  if (
    Array.isArray(luaIncrFnResult) &&
    luaIncrFnResult.length === 2 &&
    typeof luaIncrFnResult[0] === "number" &&
    typeof luaIncrFnResult[1] === "number"
  ) {
    return { requests: luaIncrFnResult[0], ttl: luaIncrFnResult[1] };
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
