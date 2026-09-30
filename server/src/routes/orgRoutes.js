import * as orgRoutes from "../controllers/org.controllers.js";
import express from "express";

import authorize from "../middleware/authorize.middelware.js";

const router = express.Router();

router.post("/get-org", authorize, orgRoutes.getOrg);
router.post("/create-org", authorize, orgRoutes.createOrg);
router.get("/all-organizations", authorize, orgRoutes.getAllOrganizations);
router.post("/all-members", authorize, orgRoutes.getMembers);
router.post("/invite", authorize, orgRoutes.inviteMembers);
router.post("/accept-invitation", authorize, orgRoutes.acceptInvitation);
router.post("/member", authorize, orgRoutes.getSingleMember);
router.delete("/delete", authorize, orgRoutes.deleteOrganization);

export default router;
