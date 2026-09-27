import express from "express";
import * as activityController from "../controllers/activity.controllers.js";
import authorize from "../middleware/authorize.middelware.js";

const router = express.Router();

router.post(
  "/organization",
  authorize,
  activityController.getOrganizationActivity,
);
router.post("/project", authorize, activityController.getProjectActivity);

export default router;
