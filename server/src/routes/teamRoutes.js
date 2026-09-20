import * as teamRoutes from "../controllers/team.controllers.js";
import authorize from "../middleware/authorize.middelware.js";
import express from "express";
const router = express.Router();
router.post("/create-team", authorize, teamRoutes.createTeam);
router.post("/get-teams", authorize, teamRoutes.getTeams);
export default router;
