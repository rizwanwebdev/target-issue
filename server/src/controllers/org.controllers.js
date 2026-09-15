import config from "../config/config.js";
import pool from "../db/connect.js";
import crypto from "crypto";
function genJwtToken(id, type) {
  return jwt.sign({ id, sessionId, type: type }, config.JWT_SECRET, {
    expiresIn: "1day",
  });
}

/**
 * @method POST /org/create-org
 * @param {*} req
 * @param {*} res
 */
export async function createOrg(req, res) {
  try {
    console.log("createOrg");
    const { id } = req.user;
    const { name, slug, description } = req.body;
    if (!name || !slug || description) {
      return res.status(400).json({
        error: true,
        message: "All Fields are required",
      });
    }
    if (!name.length > 4 || !slug.length > 4 || description.length > 10) {
      return res.status(400).json({
        error: true,
        message: "All Fields are required with atmost 4 characters",
      });
    }
    const result = await pool.query(
      `WITH new_org AS (
    INSERT INTO organization (name, slug,description, created_by) VALUES ($1,$2, $3, $4) RETURNING id
    )
    INSERT INTO organization_members (organization_id, user_id, role, joined_at) VALUES ((SELECT id FROM new_org), $4, "admin", NOW())`,
      [name, slug, description, id],
    );
    return res.status(201).json({
      success: true,
      message: "Organization has been created.",
      slug: slug,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

/**
 * @method POST /org/invite
 * @param {*} req
 * @param {*} res
 */
export async function inviteMembers(req, res) {
  try {
    const { slug, emails } = req.body;

    if (!slug) {
      return res.status(400).json({
        error: true,
        message: "Organization id is required",
      });
    }
    if (emails.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Add one or more emails to the organization",
      });
    }

    const result = await pool.query(
      "SELECT slug FROM organization WHERE slug=$1",
      [slug],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Organization Not Found. First create one and then invite",
      });
    }

    const invitationToken = crypto.randomBytes(32).toString("hex");

    const invitationTokenHash = genJwtToken(slug, "invite");

    // Queue Emails
    emails.forEach((email) => {
      const inviteLink = `${config.CLIENT_URL}/invitations/${invitationToken}`;
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}
