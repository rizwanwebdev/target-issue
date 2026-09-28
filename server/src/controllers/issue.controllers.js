import pool from "../db/connect.js";
import { saveActivity } from "../utils/saveActivity.js";
/**
 * @method POST
 * @route /create-issue
 */
export async function createIssue(req, res) {
  try {
    const { id: USERID } = req.user;
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
    const checkMembership = await pool.query(
      `
        SELECT 1
        FROM organization_members om
        INNER JOIN project_members pm
          ON pm.user_id = om.user_id
        INNER JOIN project p
          ON p.id = pm.project_id
        AND p.organization_id = om.organization_id
        WHERE om.organization_id = $1
          AND om.user_id = $2
          AND pm.project_id = $3
      `,
      [organizationId, USERID, projectId],
    );

    if (checkMembership.rows.length === 0) {
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
    const { id: USERID } = req.user;
    const { issueId, projectId, organizationId } = req.body;

    if (!issueId || !projectId || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "Issue Id, Project Id and Organization Id is required",
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
    const { id: USERID } = req.user;

    const { issueId, projectId, organizationId, issue_status } = req.body;

    if (!issueId || !issue_status || !projectId || !organizationId) {
      return res.status(400).json({
        error: true,
        message:
          "Issue Id, Issue Status, Project Id and Organization Id is required",
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
