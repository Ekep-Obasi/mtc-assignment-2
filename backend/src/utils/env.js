import {
  DEFAULT_PORT,
  DEFAULT_MONGO_URI,
  DEFAULT_CLIENT_ORIGIN
} from "./constants.js";

// centralized environment variable access
export const env = {
  get port() { return process.env.PORT || DEFAULT_PORT; },
  get mongoUri() { return process.env.MONGODB_URI || DEFAULT_MONGO_URI; },
  get sessionSecret() { return process.env.SESSION_SECRET || "devsecret"; },
  get clientOrigin() { return process.env.CLIENT_ORIGIN || DEFAULT_CLIENT_ORIGIN; }
};
