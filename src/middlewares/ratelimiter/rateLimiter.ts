export type RateWindowSize = "second" | "minute" | "hour";
export type RateLimitResponse = {
  limited: boolean;
  remainingRequests: number;
  remainingTimeInSecs: number;
};
export type RateLimitFn = (
  key: string,
  rate: number,
  rateWindow: RateWindowSize,
) => Promise<RateLimitResponse>;
