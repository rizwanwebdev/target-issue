import pool from "../db/connect.js";
import { checkOrgMembership } from "../utils/dbUtiltyFuntions.js";

export async function countAllOrganizations(req, res) {
  const { USERID } = req.user;
}
