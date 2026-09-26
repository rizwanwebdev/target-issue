import pool from "../db/connect.js";

export async function createProject(req, res) {
  const { id: USERID } = req.user;

  let {
    organizationId,
    name,
    description,
    project_status,
    startDate,
    targetDate,
  } = req.body;

  if (
    !organizationId ||
    !name ||
    !description ||
    !project_status ||
    !startDate ||
    !targetDate
  ) {
    return res.status(400).json({
      error: true,
      message:
        "organization Id, name, description, project_status, startDate and targetDate are required to create a project",
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

  if (start >= target) {
    return res.status(400).json({
      error: true,
      message: "Target date must be after start date",
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
        "Organization does not exist or you are not allowed to create a project",
    });
  }

  await pool.query(
    `
      WITH new_project AS (
        INSERT INTO project (
          organization_id,
          name,
          description,
          created_by,
          status,
          start_date,
          target_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
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
        $8
      )
    `,
    [
      organizationId,
      name,
      description,
      USERID,
      project_status,
      start,
      target,
      "admin",
    ],
  );

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
    const { id: USERID } = req.user;
    const { organizationId } = req.body;
    if (!organizationId) {
      return res.status(400).json({
        error: true,
        message: "First join or create an organization to be in a project",
      });
    }
    const orgResult = await pool.query(
      `
    SELECT 
    o.id,
    om.organization_id,
    om.user_id
    FROM organization_members om 
    INNER JOIN organization o ON
    om.organization_id = o.id
    WHERE o.id =$1 AND om.user_id =$2
    `,
      [organizationId, USERID],
    );

    if (orgResult.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message:
          "Organization dose not found OR you are not a part of this Organization",
      });
    }
    const test = await pool.query("SELECT COUNT(*) FROM project");
    const result = await pool.query(
      `SELECT 
    p.id,
    p.organization_id,
    p.name,
    p.status,
    p.description,
    p.start_date,
    p.target_date,
    pm.user_id,
    pm.role,
    pm.project_id
    FROM project_members pm 
    INNER JOIN project p ON p.id = pm.project_id
    WHERE p.organization_id=$1 AND pm.user_id =$2`,
      [organizationId, USERID],
    );
    if (result.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Project dose not found OR you are not a part of any Project",
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
    const { id: USERID } = req.user;
    const { projectId, organizationId } = req.body;
    if (!projectId || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "Project Not Found",
      });
    }
    const orgResult = await pool.query(
      "SELECT id FROM organization WHERE id=$1",
      [organizationId],
    );

    if (orgResult.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Project Not Found",
      });
    }

    const result = await pool.query(
      `SELECT * FROM project WHERE id=$1 and organization_id=$2`,
      [projectId, organizationId],
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
