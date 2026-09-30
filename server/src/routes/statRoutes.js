import express from "express";
import * as statRoutes from "../controllers/stats.controller.js";
import authorize from "../middleware/authorize.middelware.js";

const router = express.Router();

router.get("/dash", authorize, statRoutes.countAllOrganizations);

export default router;
