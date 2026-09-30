import express from "express";
import * as statRoutes from "../controllers/stats.controller.js";
import authorize from "../middleware/authorize.middelware.js";

const router = express.Router();

router.get("/dash", authorize, statRoutes.dashboardStats);
router.post("/org", authorize, statRoutes.organizationStats);
router.post("/project", authorize, statRoutes.projectStats);

export default router;
