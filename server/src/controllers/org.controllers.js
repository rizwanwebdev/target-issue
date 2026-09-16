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
 * @method GET
 * @route /org/all-organizations
 * @returns ALl Organizations
 */
export async function getAllOrganizations(req, res) {
  const { id: userId } = req.user;
  const reuslt = await pool.query(
    "SELECT organization_id, role FROM organization_members WHERE user_id=$1 JOIN ON organization WHERE organization.id = organization_members.organization_id",
    [userId],
  );
  if (result.rows.length === 0) {
    return res.status(400).json({
      error: true,
      message: "No Organization found, create or join one",
    });
  }
  console.log(result);
  return res.status(200).json({
    success: true,
    message: "Found Organizations",
    organizations: reuslt.rows,
  });
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

export async function getMembers(req, res) {
  let { slug, page, limit } = req.body;

  if (!slug || !page || !limit) {
    return res.status(400).json({
      error: true,
      message: "Organization Slug is required with page number and limit",
    });
  }
  if (limit > 50) {
    limit = 50;
  }

  const orgResult = await pool.query(
    "SELECT id FROM organization WHERE slug=$1",
    [slug],
  );

  if (orgResult.rows.length === 0) {
    return res.status(400).json({
      error: true,
      message: "Organization Not Found",
    });
  }

  const record = await pool.query(
    "SELECT id, user_id, role FROM organization_members WHERE organization_id = $1 ORDER BY id LIMIT $2",
    [orgResult.rows[0].id, limit],
  );
  if (record.rows.length === 0) {
    return res.status(400).json({
      message: "Currently there is no user in this organization",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Found Memebers",
    memebers: record.rows,
    pagination: {
      page: page,
      limit: limit,
      total: 10,
    },
  });
}
