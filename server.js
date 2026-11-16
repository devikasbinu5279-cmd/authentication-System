import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 5001;
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("Set MONGODB_URI and JWT_SECRET in backend/.env");
  process.exit(1);
}
try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Authentication API running at http://localhost:${port}`));
} catch (error) {
  console.error("Database connection failed:", error.message);
  process.exit(1);
}
