import pool from "../db/connect.js";

export async function createProject(req, res) {
  const { id: USERID } = req.user;

  const { slug, name, description, startDate, targetDate } = req.body;
  if (!slug || !name) {
    return res.status(400).json({
      error: true,
      message: "Slug and project name are required",
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
    `SELECT
    o.id,
    o.slug,
    om.organization_id,
    om.user_id,
    om.role
    FROM organization_members om 
    INNER JOIN organization o
          ON o.id = om.organization_id
    WHERE o.slug=$1 AND om.user_id=$2 AND om.role='admin'`,
    [slug, USERID],
  );
  if (findOrg.rows.length === 0) {
    return res.status(400).json({
      error: true,
      message:
        "Organization does not exist or you are not allowed to create a project",
    });
  }

  const result = await pool.query(
    "INSERT INTO project (organization_id, name, description, created_by,start_date, target_date) VALUES ($1, $2, $3, $4,$5,$6) RETURNING id",
    [findOrg.rows[0].id, name, description, USERID, start, target],
  );
  return res.status(201).json({
    success: true,
    message: "Project Created",
    project: {
      projectId: result.rows[0].id,
      name: name,
    },
  });
}

/**
 * @method POST
 * @route /get-projects
 */
export async function getProjects(req, res) {
  const { id: USERID } = req.user;
  const { slug } = req.body;
  if (!slug) {
    return res.status(400).json({
      error: true,
      message: "First join or create an organization to be in a project",
    });
  }
  const orgResult = await pool.query(
    `
    SELECT 
    o.slug,
    o.id,
    om.organization_id,
    om.user_id
    FROM organization_members om 
    INNER JOIN organization o ON
    om.organization_id = o.id
    WHERE o.slug =$1 AND om.user_id =$1
    `,
    [slug, USERID],
  );

  if (orgResult.rows.length === 0) {
    return res.status(400).json({
      error: true,
      message:
        "Organization dose not found OR you are not a part of this Organization",
    });
  }
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
    INNER JOIN project p ON pm.project_id = p.id
    WHERE p.organization_id=$1 AND pm.user_id =$1`,
    [orgResult.rows[0].organization_id, USERID],
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
}
