import pool from "../db/connect.js";
import { saveActivity } from "../utils/saveActivity.js";
import {
  checkOrgMembership,
  checkProjectMembership,
} from "../utils/dbUtiltyFuntions.js";
/**
 * @method POST
 * @route /create-issue
 */
export async function createIssue(req, res) {
  try {
    const { USERID } = req.user;
    const {
      organizationId,
      title,
      description,
      projectId,
      due_date,
      priority,
      severity,
    } = req.body;

    if (
      !organizationId ||
      !title ||
      !description ||
      !projectId ||
      !due_date ||
      !priority ||
      !severity
    ) {
      return res.status(400).json({
        error: true,
        message:
          "All fileds are required i.e organizationId, name, description, projectId, due_date, priority, severity",
      });
    }
    const { isMember } = await checkProjectMembership(
      USERID,
      organizationId,
      projectId,
    );

    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You do not have access to this project",
      });
    }

    const result = await pool.query(
      `
    WITH current_issue_number AS (
      UPDATE project
      SET next_issue_number = next_issue_number + 1
      WHERE id = $2
      RETURNING next_issue_number - 1 AS issue_number
    )
    INSERT INTO issues (
      organization_id, project_id, created_by, title, description, priority, severity, due_date, issue_number) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, (SELECT issue_number FROM current_issue_number)) RETURNING id, issue_number
  `,
      [
        organizationId,
        projectId,
        USERID,
        title.trim(),
        description.trim(),
        priority,
        severity,
        due_date,
      ],
    );

    await saveActivity({
      organizationId,
      projectId,
      actorId: USERID,
      message: `New Issue: #${result.rows[0].issue_number} ${title.trim()}`,
    });

    return res.status(201).json({
      success: true,
      message: "Issue created",
      issueNumber: result.rows[0].issue_number,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

/**
 * @method POST
 * @route /issue
 */

export async function getSingleIssue(req, res) {
  try {
    const { USERID } = req.user;
    const { issueId, projectId, organizationId } = req.body;

    if (!issueId || !projectId || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "Issue Id, Project Id and Organization Id is required",
      });
    }

    const { isMember } = await checkOrgMembership(USERID, organizationId);
    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }

    const issueResult = await pool.query(
      "SELECT * FROM issues WHERE id =$1 AND project_id =$2 AND organization_id =$3",
      [issueId, projectId, organizationId],
    );
    if (issueResult.rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Issue Not Found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Issue created",
      issue: issueResult.row[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}
/**
 * @method POST
 * @route /get-issues
 */

export async function getAllIssue(req, res) {
  const { USERID } = req.user;
  try {
    const { organizationId, projectId } = req.body;

    if (!organizationId) {
      return res.status(400).json({
        error: true,
        message: "Organization Id is required",
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const offset = (page - 1) * limit;

    let issueResult;
    let countResult;

    if (projectId) {
      const { isMember } = await checkProjectMembership(
        USERID,
        organizationId,
        projectId,
      );
      if (!isMember) {
        return res.status(403).json({
          error: true,
          message: "You do not have access to this project",
        });
      }
      issueResult = await pool.query(
        `
      SELECT
        i.*,
        p.name AS project_name
      FROM issues i
      INNER JOIN project p
        ON p.id = i.project_id
      WHERE i.project_id = $1
        AND i.organization_id = $2
      ORDER BY i.created_at DESC
      LIMIT $3
      OFFSET $4
    `,
        [projectId, organizationId, limit, offset],
      );

      countResult = await pool.query(
        `
      SELECT COUNT(*)::int AS total
      FROM issues
      WHERE project_id = $1
        AND organization_id = $2
    `,
        [projectId, organizationId],
      );
    } else {
      const { isMember } = await checkOrgMembership(USERID, organizationId);
      if (!isMember) {
        return res.status(403).json({
          error: true,
          message: "You are not a member of this organization",
        });
      }
      issueResult = await pool.query(
        `
      SELECT
        i.*,
        p.name AS project_name
      FROM issues i
      INNER JOIN project p
        ON p.id = i.project_id
      WHERE i.organization_id = $1
      ORDER BY i.created_at DESC
      LIMIT $2
      OFFSET $3
    `,
        [organizationId, limit, offset],
      );

      countResult = await pool.query(
        `
      SELECT COUNT(*)::int AS total
      FROM issues
      WHERE organization_id = $1
    `,
        [organizationId],
      );
    }

    const total = countResult.rows[0].total;
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: "Issues fetched successfully",
      issues: issueResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}
/**
 * @method POST
 * @route /api/v1/issues/issue-staus
 */
export async function changeIssueStatus(req, res) {
  try {
    const { USERID } = req.user;

    const { issueId, projectId, organizationId, issue_status } = req.body;

    if (!issueId || !issue_status || !projectId || !organizationId) {
      return res.status(400).json({
        error: true,
        message:
          "Issue Id, Issue Status, Project Id and Organization Id is required",
      });
    }

    const { isMember } = await checkProjectMembership(USERID, projectId);

    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You do not have access to this project",
      });
    }
    const issueStatus =
      typeof issue_status === "string"
        ? issue_status.trim().toLowerCase()
        : null;

    const ISSUE_STATUS = [
      "orphan",
      "assigned",
      "resolved",
      "archive",
      "closed",
    ];

    if (!issueStatus || !ISSUE_STATUS.includes(issueStatus)) {
      return res.status(400).json({
        error: true,
        message:
          "Issue Status should be one of these 'orphan', 'assigned', 'resolved', 'archive', 'closed'",
      });
    }

    const issueResult = await pool.query(
      `
    SELECT i.id
    FROM issues i

    INNER JOIN project_members pm
      ON pm.project_id = i.project_id
     AND pm.user_id = $4

    INNER JOIN organization_members om
      ON om.organization_id = i.organization_id
     AND om.user_id = $4

    WHERE i.id = $1
      AND i.project_id = $2
      AND i.organization_id = $3
      AND pm.role IN ('member', 'admin')
  `,
      [issueId, projectId, organizationId, USERID],
    );

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Not Authorized",
      });
    }

    const updateIssue = await pool.query(
      `
        UPDATE issues
        SET
          status = $1,
          updated_at = NOW(),
          resolved_at = CASE
            WHEN $1 = 'resolved' THEN NOW()
            ELSE resolved_at
          END,
          closed_at = CASE
            WHEN $1 = 'closed' THEN NOW()
            ELSE closed_at
          END
        WHERE id = $2
          AND project_id = $3
          AND organization_id = $4
        RETURNING id, issue_number,title, status, resolved_at, closed_at
      `,
      [issueStatus, issueId, projectId, organizationId],
    );
    const updatedIssue = updateIssue.rows[0];
    await saveActivity({
      organizationId,
      projectId,
      actorId: USERID,
      message: `#${updatedIssue.issue_number} Issue  ${updatedIssue.status}: ${updatedIssue.title}`,
    });
    return res.status(200).json({
      success: true,
      message: `Issue Updated #${issueId}`,
      issue: updateIssue.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

export async function assignIssuesToTeam(req, res) {
  try {
    const { USERID } = req.user;
    const { teamId, issueId, projectId, organizationId } = req.body;
    if (!teamId || !issueId || !organizationId || !projectId) {
      return res.status(400).json({
        error: true,
        message: "teamId, issueId, projectId and organizationId are required",
      });
    }
    const { isAdmin } = await checkProjectMembership(
      USERID,
      organizationId,
      projectId,
    );
    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        message: "Only project admins can perform this action",
      });
    }

    const result = await pool.query(
      `WITH new_issue_team AS (
    INSERT INTO  issue_teams (team_id, issue_id,assigned_by) VALUES ($1, $2, $3)
    )
    SELECT name as team_name from team WHERE id=$1
    SELECT title, issue_number FROM issues WHERE id =$2
    `,
      [teamId, issueId, USERID],
    );
    const cleaned = result.rows[0];
    await saveActivity({
      organizationId: organizationId,
      projectId: projectId,
      actorId: USERID,
      message: `Issue #${cleaned.issue_number}: ${cleaned.title} is assigned to team ${cleaned.team_name}`,
    });
    return res.status(200).json({
      success: true,
      message: `Issue #${cleaned.issue_number}: ${cleaned.title} is assigned to team ${cleaned.team_name}`,
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
        message: "This issue is already been assigned to this team.",
      });
    }

    return res.status(500).json({
      error: true,
      message: "Something went wrong while assigning this issue.",
    });
  }
}
export async function deleteIssue(req, res) {
  try {
    const { USERID } = req.user;
    const { issueId, projectId, organizationId } = req.query;

    if (!issueId || !projectId || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "issueId, projectId, organizationId is required",
      });
    }
    const { isMember, isAdmin } = await checkProjectMembership(
      USERID,
      organizationId,
      projectId,
    );
    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You do not have access to this project",
      });
    }
    let result;
    if (isAdmin) {
      result = await pool.query(
        "DELETE FROM issues WHERE id = $1 AND organization_id=$2 AND project_id=$3 RETURNING id, issue_number, title",
        [issueId, organizationId, projectId],
      );
    } else {
      result = await pool.query(
        "DELETE FROM issues WHERE id = $1 AND organization_id=$2 AND project_id=$3 AND created_by=$4 RETURNING id, issue_number, title",
        [issueId, organizationId, projectId, USERID],
      );
    }
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Issue not found Or you didn't created this issue",
      });
    }
    await saveActivity({
      organizationId,
      projectId,
      actorId: USERID,
      message: `#${result.rows[0].issue_number} issue deleted : ${result.rows[0].title}`,
    });
    return res.status(200).json({
      success: true,
      message: "Issue Deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : "Something Went Wrong",
    });
  }
}

export async function addIssueComment(req, res) {
  try {
    const { USERID } = req.user;
    const {
      organizationId,
      projectId,
      issueId,
      comment,
      parentId = null,
    } = req.body;

    if (
      !organizationId ||
      !projectId ||
      !issueId ||
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        error: true,
        message:
          "Organization ID, project ID, issue ID and comment are required",
      });
    }

    const { isMember } = await checkProjectMembership(
      USERID,
      organizationId,
      projectId,
    );

    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You do not have access to this project",
      });
    }

    // If this is a reply, make sure the parent belongs
    // to the same issue.
    if (parentId) {
      const parentResult = await pool.query(
        `
          SELECT id
          FROM issue_comments
          WHERE id = $1
            AND issue_id = $2
        `,
        [parentId, issueId],
      );

      if (parentResult.rowCount === 0) {
        return res.status(400).json({
          error: true,
          message: "Invalid parent comment",
        });
      }
    }

    const result = await pool.query(
      `
        INSERT INTO issue_comments (
          issue_id,
          user_id,
          parent_comment_id,
          content
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, issue_id, user_id, parent_comment_id, content, created_at
      `,
      [issueId, USERID, parentId, comment.trim()],
    );

    const newComment = result.rows[0];

    const userResult = await pool.query(
      `
        SELECT username, full_name, avatar_url
        FROM users
        WHERE id = $1
      `,
      [USERID],
    );

    const user = userResult.rows[0];

    return res.status(201).json({
      success: true,
      message: "Comment added",
      comment: {
        id: newComment.id,
        issueId: newComment.issue_id,
        userId: newComment.user_id,
        parentId: newComment.parent_comment_id,
        content: newComment.content,
        createdAt: newComment.created_at,
        username: user.username,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        children: [],
      },
    });
  } catch (error) {
    console.error("Add issue comment error:", error);

    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}
export async function getIssueComments(req, res) {
  try {
    const { USERID } = req.user;
    const { organizationId, projectId, issueId } = req.query;

    if (!organizationId || !projectId || !issueId) {
      return res.status(400).json({
        error: true,
        message: "Organization ID, project ID and issue ID are required",
      });
    }

    const { isMember } = await checkProjectMembership(
      USERID,
      organizationId,
      projectId,
    );

    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You do not have access to this project",
      });
    }

    // Make sure the issue belongs to this project/org.
    const issueResult = await pool.query(
      `
        SELECT id
        FROM issues
        WHERE id = $1
          AND project_id = $2
          AND organization_id = $3
      `,
      [issueId, projectId, organizationId],
    );

    if (issueResult.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Issue not found",
      });
    }

    const result = await pool.query(
      `
        SELECT
          ic.id,
          ic.issue_id,
          ic.user_id,
          ic.parent_comment_id,
          ic.content,
          ic.edited_at,
          ic.created_at,
          u.username,
          u.full_name,
          u.avatar_url
        FROM issue_comments ic
        INNER JOIN users u
          ON u.id = ic.user_id
        WHERE ic.issue_id = $1
        ORDER BY ic.created_at ASC
      `,
      [issueId],
    );

    const comments = result.rows;

    const commentMap = new Map();

    // First create every node.
    for (const comment of comments) {
      commentMap.set(comment.id, {
        id: comment.id,
        issueId: comment.issue_id,
        userId: comment.user_id,
        parentId: comment.parent_comment_id,
        content: comment.content,
        editedAt: comment.edited_at,
        createdAt: comment.created_at,
        username: comment.username,
        fullName: comment.full_name,
        avatarUrl: comment.avatar_url,
        children: [],
      });
    }

    const rootComments = [];

    // Then connect children to their parents.
    for (const comment of commentMap.values()) {
      if (comment.parentId === null) {
        rootComments.push(comment);
        continue;
      }

      const parent = commentMap.get(comment.parentId);

      if (parent) {
        parent.children.push(comment);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments: rootComments,
    });
  } catch (error) {
    console.error("Get issue comments error:", error);

    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}
