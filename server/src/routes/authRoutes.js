import express from "express";
import test from "../middleware/test.middleware.js";
const router = express.Router();
import * as authController from "../controllers/auth.controller.js";

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOtp);

router.get("/refresh", authController.refreshAccessToken);

export default router;
