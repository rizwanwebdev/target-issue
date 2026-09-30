import crypto from "crypto";
import pool from "../db/connect.js";
import config from "../config/config.js";
// import { emailQueue } from "../queue/email.queue.js";
import { saveActivity } from "../utils/saveActivity.js";
import { checkOrgMembership } from "../utils/dbUtiltyFuntions.js";

function generateInvitationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * @method POST
 * @route /org/get-org
 */
export async function getOrg(req, res) {
  try {
    const { id: USERID } = req.user;
    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({
        error: true,
        message: "Organization slug is required",
      });
    }
    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    const orgResult = await pool.query(
      `
        SELECT
          o.id,
          o.slug,
          o.name,
          o.description,
          o.logo_url,
          o.created_at,
          om.role,
          om.joined_at
        FROM organization o
        JOIN organization_members om
          ON o.id = om.organization_id
        WHERE o.slug = $1
          AND om.user_id = $2
      `,
      [cleanSlug, USERID],
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Organization not found",
      });
    }

    const organization = orgResult.rows[0];

    return res.status(200).json({
      success: true,
      message: "Organization found",
      organization,
    });
  } catch (error) {
    console.error("Get organization error:", error);

    return res.status(500).json({
      error: true,
      message: "Failed to fetch organization",
    });
  }
}

/**
 * @method POST
 * @route /org/create-org
 */
export async function createOrg(req, res) {
  try {
    const { id: USERID } = req.user;
    const { name, slug, description } = req.body;

    if (!name || !slug || !description) {
      return res.status(400).json({
        error: true,
        message: "All fields are required",
      });
    }

    if (name.trim().length < 4 || slug.trim().length < 4) {
      return res.status(400).json({
        error: true,
        message: "Name and slug must be at least 4 characters long",
      });
    }
    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    const result = await pool.query(
      `
        WITH new_org AS (
          INSERT INTO organization (
            name,
            slug,
            description,
            created_by
          )
          VALUES ($1, $2, $3, $4)
          RETURNING id
        )
        INSERT INTO organization_members (
          organization_id,
          user_id,
          role,
          joined_at
        )
        VALUES (
          (SELECT id FROM new_org),
          $4,
          $5,
          NOW()
        ) RETURNING organization_id
      `,
      [name.trim(), cleanSlug, description.trim(), USERID, "admin"],
    );
    console.log(result);
    await saveActivity({
      organizationId: result.rows[0].organization_id,
      actorId: USERID,
      message: `Organization Created: ${name.trim()}`,
    });
    return res.status(201).json({
      success: true,
      message: "Organization has been created.",
      slug: cleanSlug,
    });
  } catch (error) {
    console.log(error);
    // PostgreSQL unique violation
    if (
      error.code === "23505" &&
      error.constraint === "unique_organization_slug"
    ) {
      return res.status(409).json({
        error: true,
        message: "This organization slug is already taken.",
      });
    }

    return res.status(500).json({
      error: true,
      message: "Something went wrong while creating the organization.",
    });
  }
}

/**
 * @method GET
 * @route /org/all-organizations
 * @returns All organizations for the authenticated user
 */
export async function getAllOrganizations(req, res) {
  try {
    const { id: USERID } = req.user;

    const result = await pool.query(
      `
        SELECT
          o.id,
          o.slug,
          o.name,
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
      [USERID],
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
    const { id: USERID } = req.user;
    const { organizationId, emails } = req.body;

    if (!organizationId) {
      return res.status(400).json({
        error: true,
        message: "Organizaion Id is required",
      });
    }
    const { isMember, isAdmin } = await checkOrgMembership(
      USERID,
      organizationId,
    );

    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }

    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        message: "Only organization admins can perform this action",
      });
    }

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Add one or more emails",
      });
    }
    const normalizedEmails = emails.map((email) =>
      String(email).trim().toLowerCase(),
    );

    const uniqueEmails = [...new Set(normalizedEmails)];
    const validEmails = [];
    const invalidEmails = [];

    for (const email of uniqueEmails) {
      if (isValidEmail(email)) {
        validEmails.push(email);
      } else {
        invalidEmails.push(email);
      }
    }

    if (validEmails.length === 0) {
      return res.status(400).json({
        error: true,
        message: "No valid email addresses provided",
        invalidEmails,
      });
    }

    const invitations = [];

    for (const email of validEmails) {
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
        [organizationId, USERID, email, tokenHash],
      );

      const invitationId = result.rows[0].id;

      const inviteLink = `${config.CLIENT_URL}/invitations?token=${token}`;

      invitations.push({
        invitationId,
        email,
        inviteLink,
      });
    }
    console.log(invitations);

    // Add email jobs
    // await Promise.all(
    //   invitations.map((invitation) =>
    //     emailQueue.add(
    //       "organization-invitation",
    //       {
    //         to: invitation.email,

    //         subject: `Invitation to join ${organization.name}`,

    //         text: `You've been invited to join ${organization.name} on TargetIssue.\n\n${invitation.inviteLink}`,

    //         html: `
    //           <h2>You're invited!</h2>

    //           <p>
    //             You've been invited to join
    //             <strong>${organization.name}</strong>
    //             on TargetIssue.
    //           </p>

    //           <p>
    //             <a href="${invitation.inviteLink}">
    //               Accept Invitation
    //             </a>
    //           </p>

    //           <p>
    //             This invitation expires in 24 hours.
    //           </p>
    //         `,
    //       },
    //       {
    //         attempts: 3,

    //         backoff: {
    //           type: "exponential",
    //           delay: 5000,
    //         },

    //         removeOnComplete: true,
    //       },
    //     ),
    //   ),
    // );

    return res.status(202).json({
      success: true,
      message: "Invitations queued successfully",

      invitations: invitations.map(({ invitationId, email }) => ({
        invitationId,
        email,
      })),
      invalidEmails: invalidEmails,
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
 * @route /org/all-members
 */
export async function getMembers(req, res) {
  const { id: USERID } = req.user;
  try {
    let { organizationId, page = 1, limit = 20, projectId } = req.body;

    page = Number(page);
    limit = Number(limit);

    if (!organizationId || !Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        error: true,
        message: "Valid organization Id and page number is required",
      });
    }
    const { isMember } = await checkOrgMembership(USERID, organizationId);

    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 20;
    }

    if (limit > 50) {
      limit = 50;
    }

    const offset = (page - 1) * limit;

    if (projectId) {
      const [membersResult, countResult] = await Promise.all([
        pool.query(
          `
          SELECT
            u.full_name,
            u.avatar_url,
            u.username,
            pm.user_id,
            pm.role,
            pm.joined_at
          FROM project_members pm
          JOIN users u
            ON u.id = pm.user_id
          WHERE pm.project_id = $1
        `,
          [projectId],
        ),

        pool.query(
          `
          SELECT COUNT(*)::integer AS total
          FROM project_members
          WHERE project_id = $1
        `,
          [projectId],
        ),
      ]);

      const total = countResult.rows[0].total;
      return res.status(200).json({
        success: true,
        message: "Found Members In This Project",
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
    } else {
      const [membersResult, countResult] = await Promise.all([
        pool.query(
          `
          SELECT
            om.user_id,
            u.full_name,
            u.avatar_url,
            u.username,
            om.role,
            om.joined_at
          FROM organization_members om
          JOIN users u
            ON u.id = om.user_id
          WHERE om.organization_id = $1
        `,
          [organizationId],
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
        message: "Found Members In This Organization",

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
    }
  } catch (error) {
    console.error("Get members error:", error);

    return res.status(500).json({
      error: true,
      message: "Failed to fetch organization members",
    });
  }
}

/**
 * @method POST
 * @route /accept-invitations
 */

export async function acceptInvitation(req, res) {
  const { id: USERID } = req.user;
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required",
    });
  }
  const tokenHash = hashToken(token);

  const tokenResult = await pool.query(
    `
      SELECT
        oi.id,
        oi.organization_id,
        oi.email,
        oi.expires_at,
        oi.accepted_at,
        oi.role,
        oi.revoked_at,
        u.id AS user_id,
        u.email AS user_email
      FROM organization_invitations oi
      JOIN users u
        ON LOWER(u.email) = LOWER(oi.email)
      WHERE oi.token_hash = $1
        AND u.id = $2
        AND oi.expires_at > NOW()
        AND oi.accepted_at IS NULL
        AND oi.revoked_at IS NULL
    `,
    [tokenHash, USERID],
  );
  if (tokenResult.rows.length === 0) {
    return res.status(400).json({
      error: true,
      message: "Invalid or expired invitation",
    });
  }

  const invitation = tokenResult.rows[0];

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        INSERT INTO organization_members
          (organization_id, user_id, role, joined_at)
        VALUES ($1, $2, $3, NOW())
      `,
      [invitation.organization_id, USERID, invitation.role],
    );

    await client.query(
      `
        UPDATE organization_invitations
        SET accepted_at = NOW()
        WHERE id = $1
          AND accepted_at IS NULL
      `,
      [invitation.id],
    );

    await client.query("COMMIT");
    await saveActivity({
      organizationId: invitation.organization_id,
      actorId: USERID,
      message: "New Memeber Joined this organization",
    });
    return res.status(201).json({
      success: true,
      message: "You have joined a new organization.",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Accept invitation error:", error);

    return res.status(500).json({
      error: true,
      message: "Failed to accept invitation",
    });
  } finally {
    client.release();
  }
}

/**
 * @method POST
 * @route /member
 */

export async function getSingleMember(req, res) {
  try {
    const { id: USERID } = req.user;
    const { username, organizationId } = req.body;
    if (!username || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "username and organization id is required to find a member",
      });
    }
    const { isMember } = checkOrgMembership(USERID, organizationId);
    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }

    const result = await pool.query(
      `
  SELECT
    u.full_name,
    u.username,
    u.avatar_url,
    om.role,
    om.joined_at
  FROM users u
  INNER JOIN organization_members om
    ON u.id = om.user_id
  WHERE u.username = $1
    AND om.organization_id = $2
  `,
      [username, organizationId],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Memeber dose not found OR you are not a part of any Memeber",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Found Memeber",
      member: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}
