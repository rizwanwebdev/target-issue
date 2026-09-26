import * as issueRoutes from "../controllers/issue.controllers.js";
import express from "express";

import authorize from "../middleware/authorize.middelware.js";

const router = express.Router();

router.post("/create-issue", authorize, issueRoutes.createIssue);
router.post("/get-issues", authorize, issueRoutes.getAllIssue);
export default router;
