import pool from "../db/connect.js";
import {
  checkOrgMembership,
  checkProjectMembership,
} from "../utils/dbUtiltyFuntions.js";
export async function getOrganizationActivity(req, res) {
  try {
    const { id: USERID } = req.user;
    const { organizationId } = req.body;
    if (!organizationId) {
      return res.status(400).json({
        error: true,
        message: "Organization Id is required",
      });
    }
    const { isMember } = checkOrgMembership(USERID, organizationId);
    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }
    const recentActivity = await pool.query(
      `
        SELECT
        a.id,
        a.message,
        a.created_at,
        u.full_name AS actor_name
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
      activities: recentActivity.rows,
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
    const { id: USERID } = req.user;
    const { organizationId, projectId } = req.body;
    if (!organizationId || !projectId) {
      return res.status(400).json({
        error: true,
        message: "Organization Id and Project Id is required",
      });
    }
    const { isMember } = await checkProjectMembership(
      USERID,
      organizationId,
      projectId,
    );

    if (!isMember) {
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
        u.full_name AS actor_name
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
      activities: recentActivity.rows,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
}

export async function recentActivityByMe(req, res) {
  try {
    const { id: USERID } = req.user;
    const recentActivity = await pool.query(
      `
        SELECT
        a.id,
        a.message,
        a.created_at,
        u.full_name AS actor_name
    FROM activity a
    LEFT JOIN users u
        ON u.id = a.actor_id
    WHERE a.actor_id = $1
    ORDER BY a.created_at DESC
    LIMIT 10`,
      [USERID],
    );
    return res.status(200).json({
      success: true,
      message: "Issues fetched successfully",
      activities: recentActivity.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}
