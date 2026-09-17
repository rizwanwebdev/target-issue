import crypto from "crypto";
import pool from "../db/connect.js";
import config from "../config/config.js";
import { emailQueue } from "../queue/email.queue.js";

function generateInvitationToken() {
  return crypto.randomBytes(32).toString("hex");
}
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
/**
 * @method POST
 * @route /org/create-org
 */
export async function createOrg(req, res) {
  try {
    const { id } = req.user;
    const { name, slug, description } = req.body;
    if (!name || !slug || !description) {
      return res.status(400).json({
        error: true,
        message: "All Fields are required",
      });
    }
    if (!name.length > 4) {
      return res.status(400).json({
        error: true,
        message: "All Fields are required with atmost 4 characters",
      });
    }
    const result = await pool.query(
      `WITH new_org AS (
    INSERT INTO organization (name, slug,description, created_by) VALUES ($1,$2, $3, $4) RETURNING id
    )
    INSERT INTO organization_members (organization_id, user_id, role, joined_at) VALUES ((SELECT id FROM new_org), $4, $5, NOW())`,
      [name, slug, description, id, "admin"],
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
 * @method GET
 * @route /org/all-organizations
 * @returns All organizations for the authenticated user
 */
export async function getAllOrganizations(req, res) {
  try {
    const { id: userId } = req.user;

    const result = await pool.query(
      `
        SELECT
          o.id,
          o.name,
          o.slug,
          o.description,
          o.logo_url,
          o.created_at,
          om.role,
          om.joined_at
        FROM organization_members om
        INNER JOIN organization o
          ON o.id = om.organization_id
        WHERE om.user_id = $1
        ORDER BY o.created_at DESC
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "No organizations found, create or join one",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Organizations found",
      organizations: result.rows,
    });
  } catch (error) {
    console.error("Get organizations error:", error);

    return res.status(500).json({
      error: true,
      message: "Failed to fetch organizations",
    });
  }
}
/**
 * @method POST
 * @route /org/invite
 */
export async function inviteMembers(req, res) {
  try {
    const { id: userId } = req.user;
    const { slug, emails } = req.body;

    if (!slug) {
      return res.status(400).json({
        error: true,
        message: "Organization slug is required",
      });
    }

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Add one or more emails",
      });
    }

    // Remove duplicates
    const uniqueEmails = [
      ...new Set(emails.map((email) => email.trim().toLowerCase())),
    ];

    // Find organization + user's role
    const organizationResult = await pool.query(
      `
        SELECT
          o.id,
          o.name,
          om.role
        FROM organization o

        JOIN organization_members om
          ON om.organization_id = o.id

        WHERE o.slug = $1
        AND om.user_id = $2
      `,
      [slug, userId],
    );

    if (organizationResult.rows.length === 0) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }

    const organization = organizationResult.rows[0];

    // Authorization
    if (organization.role !== "admin") {
      return res.status(403).json({
        error: true,
        message: "You don't have permission to invite members",
      });
    }

    const invitations = [];

    for (const email of uniqueEmails) {
      const token = generateInvitationToken();
      const tokenHash = hashToken(token);

      const result = await pool.query(
        `
          INSERT INTO organization_invitations (
            organization_id,
            invited_by,
            email,
            token_hash,
            expires_at
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            NOW() + INTERVAL '1 day'
          )
          RETURNING id
        `,
        [organization.id, userId, email, tokenHash],
      );

      const invitationId = result.rows[0].id;

      const inviteLink = `${config.CLIENT_URL}/invitations/${token}`;

      invitations.push({
        invitationId,
        email,
        inviteLink,
      });
    }

    // Add email jobs
    await Promise.all(
      invitations.map((invitation) =>
        emailQueue.add(
          "organization-invitation",
          {
            to: invitation.email,

            subject: `Invitation to join ${organization.name}`,

            text: `You've been invited to join ${organization.name} on TargetIssue.\n\n${invitation.inviteLink}`,

            html: `
              <h2>You're invited!</h2>

              <p>
                You've been invited to join
                <strong>${organization.name}</strong>
                on TargetIssue.
              </p>

              <p>
                <a href="${invitation.inviteLink}">
                  Accept Invitation
                </a>
              </p>

              <p>
                This invitation expires in 24 hours.
              </p>
            `,
          },
          {
            attempts: 3,

            backoff: {
              type: "exponential",
              delay: 5000,
            },

            removeOnComplete: true,
          },
        ),
      ),
    );

    return res.status(202).json({
      success: true,
      message: "Invitations queued successfully",

      invitations: invitations.map(({ invitationId, email }) => ({
        invitationId,
        email,
      })),
    });
  } catch (error) {
    console.error("Invite members error:", error);

    return res.status(500).json({
      error: true,
      message: "Failed to create invitations",
    });
  }
}
/**
 * @method POST
 * @route /org/members
 */
/**
 * @method POST
 * @route /org/members
 */
export async function getMembers(req, res) {
  try {
    let { slug, page = 1, limit = 20 } = req.body;

    page = Number(page);
    limit = Number(limit);

    if (!slug || !Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        error: true,
        message: "Valid organization slug and page are required",
      });
    }

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 20;
    }

    if (limit > 50) {
      limit = 50;
    }

    const orgResult = await pool.query(
      `
        SELECT id
        FROM organization
        WHERE slug = $1
      `,
      [slug],
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Organization not found",
      });
    }

    const organizationId = orgResult.rows[0].id;

    const offset = (page - 1) * limit;

    const [membersResult, countResult] = await Promise.all([
      pool.query(
        `SELECT
          om.id,
          om.user_id,
          u.full_name,
          u.email,
          u.avatar_url,
          om.role,
          om.joined_at
          FROM organization_members om
          JOIN users u
              ON u.id = om.user_id
          WHERE om.organization_id = $1
          ORDER BY om.id
          LIMIT $2
          OFFSET $3
          `,
        [organizationId, limit, offset],
      ),

      pool.query(
        `
            SELECT COUNT(*)::integer AS total
            FROM organization_members
            WHERE organization_id = $1
          `,
        [organizationId],
      ),
    ]);

    const total = countResult.rows[0].total;

    return res.status(200).json({
      success: true,
      message: "Members found",

      members: membersResult.rows,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get members error:", error);

    return res.status(500).json({
      error: true,
      message: "Failed to fetch organization members",
    });
  }
}
