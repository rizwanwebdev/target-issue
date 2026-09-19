import pool from "../db/connect.js";

/**
 * @method POST
 * @route /create-team
 */
export async function createTeam(req, res) {
  const { id: USERID } = req.user;
  const { slug, name, description, color } = req.body;
  if (!name) {
    return res.status(400).json({
      error: true,
      message: "Name is required to create a team",
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
}
