import express from "express";
import rateLimit from "express-rate-limit";
// Strict Rate Limiter for Auth Routes

import authRoutes from "./authRoutes.js";
import orgRoutes from "./orgRoutes.js";

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

const router = express.Router();

router.use("/auth", authLimiter, authRoutes);
router.use("/org", orgRoutes);

export default router;
