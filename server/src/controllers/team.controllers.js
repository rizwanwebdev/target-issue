import pool from "../db/connect.js";
import { saveActivity } from "../utils/saveActivity.js";
import { cleanSlug, isValidSlug } from "../utils/slugValidator.js";

import {
  checkOrgMembership,
  checkProjectMembership,
  checkTeamMembership,
} from "../utils/dbUtiltyFuntions.js";
/**
 * @method POST
 * @route /create-team
 */
export async function createTeam(req, res) {
  try {
    const { USERID } = req.user;
    const { organizationId, name, description, color, slug } = req.body;
    if (!name || !organizationId || !slug || !description || !color) {
      return res.status(400).json({
        error: true,
        message:
          "All feilds are required. organizationId, name, description, color, slug",
      });
    }
    if (!name || name.length < 6) {
      return res.status(400).json({
        error: true,
        message: "Name is required to create a team minimum 6 characters",
      });
    }

    const cleanedSlug = cleanSlug(slug);
    if (!isValidSlug(cleanedSlug)) {
      return res.status(400).json({
        error: true,
        message: "Invalid slug format",
      });
    }

    const { isAdmin } = await checkOrgMembership(USERID, organizationId);
    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        message: "Only organization admins can perform this action",
      });
    }

    await pool.query(
      `WITH new_team AS (
    INSERT INTO team (organization_id, name, description, created_by,color,slug) VALUES ($1, $2, $3, $4,$5, $6) RETURNING id
    )
    INSERT INTO team_members (team_id, user_id, role) VALUES ((SELECT id FROM new_team), $4, $7)
    `,
      [
        organizationId,
        name.trim(),
        description.trim(),
        USERID,
        color.trim(),
        cleanedSlug,
        "admin",
      ],
    );
    await saveActivity({
      organizationId,
      projectId: null,
      actorId: USERID,
      message: `New Team Created: ${name.trim()}`,
    });
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
    const { USERID } = req.user;
    const { organizationId, projectId } = req.body;
    if (!organizationId) {
      return res.status(400).json({
        error: true,
        message: "First join or create an organization to be in a team",
      });
    }

    let result;
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
      result = await pool.query(
        `
        SELECT
          t.slug,
          t.name,
          t.description,
          t.color,
          t.created_by,
          pt.assigned_at,
          pt.team_id,
          tm.role
        FROM project_teams pt
        INNER JOIN team t
          ON t.id = pt.team_id
        LEFT JOIN team_members tm
          ON tm.team_id = t.id
          AND tm.user_id = $2
        WHERE pt.project_id = $1 AND t.organization_id =$3
        ORDER BY t.name
      `,
        [projectId, USERID, organizationId],
      );
    } else {
      const { isMember } = await checkOrgMembership(USERID, organizationId);
      if (!isMember) {
        return res.status(403).json({
          error: true,
          message: "You are not a member of this organization",
        });
      }

      result = await pool.query(
        `
          SELECT
            t.slug,
            t.name,
            t.description,
            t.color,
            t.created_by,
            t.id AS team_id,
            tm.role
          FROM team t
          LEFT JOIN team_members tm
            ON tm.team_id = t.id
            AND tm.user_id = $2
          WHERE t.organization_id = $1
          ORDER BY t.name
        `,
        [organizationId, USERID],
      );
    }

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
    const { USERID } = req.user;
    const { teamId, organizationId } = req.body;
    if (!teamId || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "Team Not Found",
      });
    }
    const { isMember } = await checkOrgMembership(USERID, organizationId);
    if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }

    const result = await pool.query(
      `
    SELECT
      t.*,
      COUNT(all_tm.id) AS member_count,
      current_tm.role 
    FROM team t

    -- All members: used for the count
    LEFT JOIN team_members all_tm
      ON all_tm.team_id = t.id

    -- Current user: used to get their role
    LEFT JOIN team_members current_tm
      ON current_tm.team_id = t.id
      AND current_tm.user_id = $3

    WHERE t.slug = $1
      AND t.organization_id = $2

    GROUP BY t.id, current_tm.role
  `,
      [teamId, organizationId, USERID],
    );

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

/**
 * @method POST
 * @route /assign-teams
 */

export async function assignTeams(req, res) {
  try {
    const { USERID } = req.user;
    const { projectId, organizationId, teamIds } = req.body;

    if (
      !projectId ||
      !organizationId ||
      !Array.isArray(teamIds) ||
      teamIds.length === 0
    ) {
      return res.status(400).json({
        error: true,
        message: "projectId, organizationId and at least one team are required",
      });
    }

    const validTeamIds = teamIds.every((id) => Number.isInteger(id) && id > 0);

    if (!validTeamIds) {
      return res.status(400).json({
        error: true,
        message: "Invalid team IDs",
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

    const checkTeams = await pool.query(
      `
        SELECT
          t.id,
          t.name AS team_name,
          p.name AS project_name
        FROM team t
        INNER JOIN project p
          ON p.organization_id = t.organization_id
        WHERE p.id = $1
          AND p.organization_id = $2
          AND t.id = ANY($3::int[])
      `,
      [projectId, organizationId, teamIds],
    );

    if (checkTeams.rows.length !== teamIds.length) {
      return res.status(400).json({
        error: true,
        message: "One or more teams do not belong to this organization",
      });
    }

    await pool.query(
      `
        INSERT INTO project_teams (
          project_id,
          team_id,
          assigned_by
        )
        SELECT
          $1,
          team_id,
          $3
        FROM unnest($2::int[]) AS team_id
        ON CONFLICT (project_id, team_id)
        DO NOTHING
      `,
      [projectId, teamIds, USERID],
    );

    const teamNames = checkTeams.rows.map((team) => team.team_name).join(", ");

    await saveActivity({
      organizationId,
      projectId,
      actorId: USERID,
      message: `Team${checkTeams.rows.length > 1 ? "s" : ""} ${teamNames} assigned to ${checkTeams.rows[0].project_name}`,
    });

    return res.status(201).json({
      success: true,
      message: "Teams assigned successfully",
    });
  } catch (error) {
    console.error("Assign teams error:", error);

    return res.status(500).json({
      error: true,
      message: "Something went wrong while assigning teams",
    });
  }
}
export async function deleteTeam(req, res) {
  try {
    const { USERID } = req.user;
    const { teamId, organizationId } = req.body;

    if (!teamId || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "Team id and organization Id is required",
      });
    }
    const { isAdmin } = checkTeamMembership(USERID, organizationId, teamId);
    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        message: "Only project admins can perform this action",
      });
    }

    await pool.query("DELETE FROM team WHERE id = $1 AND organization_id=$2", [
      teamId,
      organizationId,
    ]);
    return res.status(200).json({
      success: true,
      message: "Team Deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : "Something Went Wrong",
    });
  }
}
export async function removeTeamMember(req, res) {
  try {
    const { USERID } = req.user;
    const { memberId, teamId, organizationId } = req.body;

    if (!teamId || !memberId || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "memberId, teamId, organizationId is required",
      });
    }

    const { isAdmin } = await checkTeamMembership(
      USERID,
      organizationId,
      teamId,
    );

    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        message: "Only Team admins can perform this action",
      });
    }
    if (USERID === memberId) {
      return res.status(403).json({
        error: true,
        message: "Your can not remove yourself from Team",
      });
    }
    await pool.query(
      "DELETE FROM team_members WHERE team_id=$1 AND user_id = $2",
      [teamId, memberId],
    );
    return res.status(200).json({
      success: true,
      message: "Member Removed From This Team",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : "Something Went Wrong",
    });
  }
}
