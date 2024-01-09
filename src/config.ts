import { resolve } from "path";
import { EnvType, load } from "ts-dotenv";

const schema = {
  PORT: {
    type: Number,
    default: 3000,
  },
  REDIS_URL: {
    type: String,
    default: "redis://localhost:6379",
  },
  RATE_PRIVATE: {
    type: Number,
    default: 200,
  },
  RATE_PUBLIC: {
    type: Number,
    default: 100,
  },
  RATE_WINDOW: {
    type: ["second" as const, "minute" as const, "hour" as const],
    default: "hour" as const,
  },
  SECRET_TOKEN: {
    type: String,
    default: "c2VjcmV0IHRva2VuCg==",
  },
};

export type Env = EnvType<typeof schema>;

export let config: Env;

export function loadConfig(): void {
  config = load(schema, resolve(__dirname, "..", ".env"));
}
