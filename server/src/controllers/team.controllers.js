import pool from "../db/connect.js";

/**
 * @method POST
 * @route /create-team
 */
export async function createTeam(req, res) {
  const { id: USERID } = req.user;
  const { slug, name, description, color } = req.body;
  if (!name || name.length < 6) {
    return res.status(400).json({
      error: true,
      message: "Name is required to create a team minimum 6 characters",
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
        "Organization dose not found OR your or not allowed to create a team",
    });
  }

  const result = await pool.query(
    "INSERT INTO team (organization_id, name, description, color) VALUES ($1, $2, $3, $4) RETURNING id",
    [findOrg.rows[0].id, name, description, color],
  );
  return res.status(201).json({
    success: true,
    message: "Team Created",
    team: {
      teamId: result.rows[0].id,
      name: name,
      color: color,
    },
  });
}

/**
 * @method POST
 * @route /get-teams
 */
export async function getTeams(req, res) {
  const { id: USERID } = req.user;
  const { slug } = req.body;
  if (!slug) {
    return res.status(400).json({
      error: true,
      message: "First join or create an organization to be in a team",
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
    WHERE o.slug =$1 AND om.user_id =$2
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
    t.id,
    t.organization_id,
    t.name,
    t.color,
    tm.user_id,
    tm.role,
    tm.team_id
    FROM team_members tm 
    INNER JOIN team t ON tm.team_id = t.id
    WHERE tm.organization_id=$1 AND tm.user_id =$2`,
    [orgResult.rows[0].organization_id, USERID],
  );

  if (result.rows.length === 0) {
    return res.status(400).json({
      error: true,
      message: "Team dose not found OR you are not a part of any Team",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Found Teams",
    teams: result.rows,
  });
}
