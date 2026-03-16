// bcrypt salt rounds for password hashing
export const SALT_ROUNDS = 10;

// default server port
export const DEFAULT_PORT = 3000;

// default mongodb uri
export const DEFAULT_MONGO_URI = "mongodb://localhost:27017/nsm";

// default client origin for CORS
export const DEFAULT_CLIENT_ORIGIN = "http://localhost:4200";

// mongo connection timeout in ms
export const MONGO_TIMEOUT_MS = 5000;

// allowed request status transitions
export const REQUEST_TRANSITIONS = {
  open: ["quoted", "cancelled"],
  quoted: ["assigned", "cancelled"],
  assigned: ["completed"],
  completed: [],
  cancelled: []
};
