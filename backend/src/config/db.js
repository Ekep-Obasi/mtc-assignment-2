import mongoose from "mongoose";
import { env } from "../utils/env.js";
import { MONGO_TIMEOUT_MS } from "../utils/constants.js";

const connectDB = async () => {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: MONGO_TIMEOUT_MS });
  console.log("MongoDB connected:", mongoose.connection.name);
};

export default connectDB;
