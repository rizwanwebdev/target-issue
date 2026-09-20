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
