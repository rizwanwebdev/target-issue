import pool from "../db/connect.js";
// import { checkOrgMembership } from "../utils/dbUtiltyFuntions.js";

/**
 * @method GET
 * @route /stats/dash
 */
export async function dashboardStats(req, res) {
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

export async function organizationStats(req, res) {
  const { organizationId } = req.body;

  const result = await pool.query(
    `
      SELECT
        (
          SELECT COUNT(*)
          FROM organization_members
          WHERE organization_id = $1
        ) AS members_count,

        (
          SELECT COUNT(*)
          FROM project
          WHERE organization_id = $1
        ) AS project_count,

        (
          SELECT COUNT(*)
          FROM team
          WHERE organization_id = $1
        ) AS team_count,

        (
          SELECT COUNT(*) FILTER (
            WHERE status NOT IN ('resolved', 'archived', 'closed')
          )
          FROM issues
          WHERE organization_id = $1
        ) AS open_issues
    `,
    [organizationId],
  );

  return res.status(200).json({
    success: true,
    message: "Counts fetched",
    stats: result.rows[0],
  });
}
export async function projectStats(req, res) {
  const { organizationId, projectId } = req.body;

  const result = await pool.query(
    `
      SELECT
        (
          SELECT COUNT(*)
          FROM project_members
          WHERE project_id =$2
        ) AS members_count,


        (
          SELECT COUNT(*)
          FROM project_teams
          WHERE  project_id =$2
        ) AS team_count,

        (
          SELECT COUNT(*) FILTER (
            WHERE status NOT IN ('resolved', 'archived', 'closed')
          )
          FROM issues
          WHERE organization_id = $1 AND project_id =$2
        ) AS open_issues
    `,
    [organizationId, projectId],
  );

  return res.status(200).json({
    success: true,
    message: "Counts fetched",
    stats: result.rows[0],
  });
}
