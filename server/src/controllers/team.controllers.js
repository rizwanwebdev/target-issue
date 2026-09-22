import pool from "../db/connect.js";

/**
 * @method POST
 * @route /create-team
 */
export async function createTeam(req, res) {
  try {
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
      `WITH new_team AS (
    INSERT INTO team (organization_id, name, description, created_by,color) VALUES ($1, $2, $3, $4,$5) RETURNING id
    )
    INSERT INTO team_members (team_id, user_id, role) VALUES ((SELECT id FROM new_team), $4, $6)
    `,
      [findOrg.rows[0].id, name, description, USERID, color, "admin"],
    );

    return res.status(201).json({
      success: true,
      message: "Team Created",
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
 * @route /get-teams
 */
export async function getTeams(req, res) {
  try {
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
    t.description,
    tm.user_id,
    tm.role,
    tm.team_id
    FROM team_members tm 
    INNER JOIN team t ON  t.id = tm.team_id 
    WHERE t.organization_id=$1 AND tm.user_id =$2`,
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
 * @route /team
 */

export async function getSingleTeam(req, res) {
  try {
    const { id: USERID } = req.user;
    const { teamId, slug } = req.body;
    if (!teamId || !slug) {
      return res.status(400).json({
        error: true,
        message: "Team Not Found",
      });
    }
    const orgResult = await pool.query(
      "SELECT id FROM organization WHERE slug=$1",
      [slug],
    );

    if (orgResult.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Team Not Found",
      });
    }
    const orgId = orgResult.rows[0].id;

    const result = await pool.query(
      `SELECT * FROM team WHERE id=$1 and organization_id=$2`,
      [teamId, orgId],
    );
    console.log(orgId, USERID, result);

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Team dose not found OR you are not a part of any Team",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Found Team",
      team: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}
