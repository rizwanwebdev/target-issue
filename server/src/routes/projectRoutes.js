import * as projectRoutes from "../controllers/project.controllers.js";
import authorize from "../middleware/authorize.middelware.js";
import express from "express";
const router = express.Router();
router.post("/create-project", authorize, projectRoutes.createProject);
router.post("/get-projects", authorize, projectRoutes.getProjects);
router.post("/project", authorize, projectRoutes.getSingleProject);
export default router;
