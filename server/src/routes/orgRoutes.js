import * as orgRoutes from "../controllers/org.controllers.js";
import express from "express";

import authorize from "../middleware/authorize.middelware.js";

const router = express.Router();

router.post("/create-org", authorize, orgRoutes.createOrg);
router.post("/all-organizations", authorize, orgRoutes.getAllOrganizations);
router.post("/invite", authorize, orgRoutes.inviteMembers);
router.post("/members", authorize, orgRoutes.getMembers);

export default router;
