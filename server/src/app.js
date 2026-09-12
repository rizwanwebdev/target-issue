import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import requestLogger from "./middleware/requestLogger.js";
import authRoutes from "./routes/authRoutes.js";
import rateLimit from "express-rate-limit";

const app = express();
app.use(helmet());
app.set("trust proxy", 1);

app.use(express.json());

// Strict Rate Limiter for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth requests per window
  message: {
    error: true,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(requestLogger);

app.use("/api/v1/auth", authLimiter, authRoutes);

export default app;
