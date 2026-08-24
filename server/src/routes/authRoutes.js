import express from "express"
import test from "../middleware/test.middleware.js";
const router = express.Router()

router.get("/test",test, (req, res)=>{
    res.json({
    message: "TargetIssue API is running",
  });
})



export default router