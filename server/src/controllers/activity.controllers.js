import pool from "../db/connect.js";

export async function getOrganizationActivity(req, res) {
  try {
    const { organizationId } = req.body;
    if (!organizationId) {
      return res.status(400).json({
        error: true,
        message: "Organization Id is required",
      });
    }
    const findOrg = await pool.query(
      `
      SELECT o.id
      FROM organization_members om
      INNER JOIN organization o
        ON o.id = om.organization_id
      WHERE o.id = $1
        AND om.user_id = $2
        AND om.role = 'admin'
    `,
      [organizationId, USERID],
    );

    if (findOrg.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message:
          "Organization does not exist or you are not a part of this organization",
      });
    }
    const recentActivity = await pool.query(
      `
        SELECT
        a.id,
        a.message,
        a.created_at,
        a.actor_id,
        u.name AS actor_name
    FROM activity a
    LEFT JOIN users u
        ON u.id = a.actor_id
    WHERE a.organization_id = $1
    ORDER BY a.created_at DESC
    LIMIT 10`,
      [organizationId],
    );
    return res.status(200).json({
      success: true,
      message: "Recent Activity",
      activity: recentActivity.rows,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
}
export async function getProjectActivity(req, res) {
  try {
    const { organizationId, projectId } = req.body;
    if (!organizationId || !projectId) {
      return res.status(400).json({
        error: true,
        message: "Organization Id and Project Id is required",
      });
    }
    const checkMembership = await pool.query(
      `
        SELECT 1
        FROM organization_members om
        INNER JOIN project_members pm
          ON pm.user_id = om.user_id
        INNER JOIN project p
          ON p.id = pm.project_id
        AND p.organization_id = om.organization_id
        WHERE om.organization_id = $1
          AND om.user_id = $2
          AND pm.project_id = $3
      `,
      [organizationId, USERID, projectId],
    );

    if (checkMembership.rows.length === 0) {
      return res.status(403).json({
        error: true,
        message: "You do not have access to this project",
      });
    }

    const recentActivity = await pool.query(
      `
        SELECT
        a.id,
        a.message,
        a.created_at,
        a.actor_id,
        u.name AS actor_name
    FROM activity a
    LEFT JOIN users u
        ON u.id = a.actor_id
    WHERE a.organization_id = $1 AND a.project_id =$2
    ORDER BY a.created_at DESC
    LIMIT 10`,
      [organizationId, projectId],
    );
    return res.status(200).json({
      success: true,
      message: "Recent Activity",
      activity: recentActivity.rows,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
}
