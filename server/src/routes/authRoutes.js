import express from "express";
import test from "../middleware/test.middleware.js";
import * as authController from "../controllers/auth.controller.js";

import authorize from "../middleware/authorize.middelware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOtp);

router.get("/refresh", authController.refreshAccessToken);

router.get("/reset-password", authorize, authController.resetPassword);

export default router;
