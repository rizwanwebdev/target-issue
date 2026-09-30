import pool from "../db/connect.js";
import { saveActivity } from "../utils/saveActivity.js";
import { checkOrgMembership } from "../utils/dbUtiltyFuntions.js";
import { cleanSlug, isValidSlug } from "../utils/slugValidator.js";
export async function createProject(req, res) {
  const { USERID } = req.user;

  let {
    organizationId,
    name,
    slug,
    description,
    project_status,
    startDate,
    targetDate,
  } = req.body;

  if (
    !organizationId ||
    !slug ||
    !name ||
    !description ||
    !project_status ||
    !startDate ||
    !targetDate
  ) {
    return res.status(400).json({
      error: true,
      message:
        "organization Id, name,slug, description, project_status, startDate and targetDate are required to create a project",
    });
  }

  const cleanedSlug = cleanSlug(slug);
  if (!isValidSlug(cleanedSlug)) {
    return res.status(400).json({
      error: true,
      message: "Invalid slug format",
    });
  }
  const PROJECT_STATUSES = ["new", "ongoing", "completed", "archive"];

  project_status = project_status.toLowerCase();

  if (!PROJECT_STATUSES.includes(project_status)) {
    return res.status(400).json({
      error: true,
      message: "Invalid project status",
    });
  }

  const start = new Date(startDate);
  const target = new Date(targetDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(target.getTime())) {
    return res.status(400).json({
      error: true,
      message: "Invalid start or target date",
    });
  }

  if (start > target) {
    return res.status(400).json({
      error: true,
      message: "Target date must be after start date",
    });
  }
  const { isAdmin } = await checkOrgMembership(USERID, organizationId);
  if (!isAdmin) {
    return res.status(403).json({
      error: true,
      message: "Only organization admins can perform this action",
    });
  }
  const result = await pool.query(
    `
      WITH new_project AS (
        INSERT INTO project (
          organization_id,
          name,
          description,
          created_by,
          status,
          start_date,
          target_date,
          slug
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
        RETURNING id
      )
      INSERT INTO project_members (
        project_id,
        user_id,
        role
      )
      VALUES (
        (SELECT id FROM new_project),
        $4,
        $9
      ) RETURNING project_id
    `,
    [
      organizationId,
      name.trim(),
      description.trim(),
      USERID,
      project_status,
      start,
      target,
      cleanedSlug,
      "admin",
    ],
  );
  await saveActivity({
    organizationId,
    projectId: result.rows[0].project_id,
    actorId: USERID,
    message: `New Project Created: ${name.trim()}`,
  });
  return res.status(201).json({
    success: true,
    message: "Project Created",
  });
}

/**
 * @method POST
 * @route /get-projects
 */
export async function getProjects(req, res) {
  try {
    const { USERID } = req.user;
    const { organizationId } = req.body;
    if (!organizationId) {
      return res.status(400).json({
        error: true,
        message: "First join or create an organization to be in a project",
      });
    }
    const { isMember } = await checkOrgMembership(USERID, organizationId);
    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }
    const result = await pool.query(
      `SELECT 
    p.id,
    p.organization_id,
    p.slug,
    p.name,
    p.status,
    p.description,
    p.start_date,
    p.target_date,
    p.created_at,
    pm.role
    FROM project_members pm 
    INNER JOIN project p ON p.id = pm.project_id
    WHERE p.organization_id=$1 AND pm.user_id =$2`,
      [organizationId, USERID],
    );
    if (result.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Project dose not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Found Projects",
      projects: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

/**
 * @method POST
 * @route /project
 */

export async function getSingleProject(req, res) {
  try {
    const { USERID } = req.user;
    const { projectId, organizationId } = req.body;
    if (!projectId || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "Project Not Found",
      });
    }

    const { isMember } = await checkOrgMembership(USERID, organizationId);
    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }

    const result = await pool.query(
      `SELECT 
    p.id,
    p.slug,
    p.organization_id,
    p.name,
    p.status,
    p.description,
    p.start_date,
    p.target_date,
    p.created_at,
    pm.role
    FROM project_members pm 
    INNER JOIN project p ON p.id = pm.project_id
    WHERE p.organization_id=$1 AND p.slug=$2 AND pm.user_id =$3`,
      [organizationId, projectId, USERID],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Project dose not found OR you are not a part of any Project",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Found Project",
      project: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}
