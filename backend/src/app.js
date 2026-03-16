import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { env } from "./utils/env.js";
import connectDB from "./config/db.js";
import sessionMiddleware from "./config/session.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";

const app = express();

app.use(cors({
  origin: env.clientOrigin,
  credentials: true
}));

app.use(express.json());
app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/quotes", quoteRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
