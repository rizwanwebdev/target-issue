import * as issueRoutes from "../controllers/issue.controllers.js";
import express from "express";

import authorize from "../middleware/authorize.middelware.js";

const router = express.Router();

router.post("/create-issue", authorize, issueRoutes.createIssue);
router.post("/get-issues", authorize, issueRoutes.getAllIssue);
router.delete("/delete", authorize, issueRoutes.deleteIssue);
router.post("/post-comment", authorize, issueRoutes.addIssueComment);
router.get("/get-comments", authorize, issueRoutes.getIssueComments);
router.put("/change-status", authorize, issueRoutes.changeIssueStatus);
export default router;
