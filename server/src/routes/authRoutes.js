import express from "express"
import test from "../middleware/test.middleware.js";
const router = express.Router()
import * as authController from "../controllers/auth.controller.js"


router.get("/register", authController.register)



export default router