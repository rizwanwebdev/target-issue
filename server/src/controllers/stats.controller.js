import pool from "../db/connect.js";
// import { checkOrgMembership } from "../utils/dbUtiltyFuntions.js";

/**
 * @method GET
 * @route /stats/dash
 */
export async function countAllOrganizations(req, res) {
  const { USERID } = req.user;

  const result = await pool.query(
    `
      SELECT
        (SELECT COUNT(*)
         FROM organization_members
         WHERE user_id = $1) AS organization_count,

        (SELECT COUNT(*)
         FROM project_members
         WHERE user_id = $1) AS project_count,

        (SELECT COUNT(*)
         FROM team_members
         WHERE user_id = $1) AS team_count
    `,
    [USERID],
  );

  return res.status(200).json({
    success: true,
    message: "Counts fetched",
    stats: result.rows[0],
  });
}
