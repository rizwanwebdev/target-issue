import pool from "../db/connect.js";
/**
 * @example 
 * const { isMember } = await checkOrgMembership(USERID, organizationId);
 * if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }
  const { isMember , isAdmin } = await checkOrgMembership(USERID, organizationId);
    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        message: "Only organization admins can perform this action",
      });
    }
 * @returns isMember, isAdmin, role
 */
export async function checkOrgMembership(userId, organizationId) {
  const result = await pool.query(
    `
      SELECT role
      FROM organization_members
      WHERE organization_id = $1
        AND user_id = $2
    `,
    [organizationId, userId],
  );

  if (result.rows.length === 0) {
    return {
      isMember: false,
      isAdmin: false,
      role: null,
    };
  }

  const { role } = result.rows[0];

  return {
    isMember: true,
    isAdmin: role === "admin",
    role,
  };
}

/**
 * @example 
 * 
 *  const { isMember } = await checkProjectMembership(USERID,organizationId,projectId);
 * 
 *if (!isMember) {return res.status(403).json({
      error: true, message: "You do not have access to this project"});}

  const { isMember, isAdmin } = await checkProjectMembership(USERID,organizationId,projectId);

  if (!isAdmin) {return res.status(403).json({
      error: true, message: "Only project admins can perform this action"});}
 * @returns isMember, isAdmin, role
 */
export async function checkProjectMembership(
  userId,
  organizationId,
  projectId,
) {
  const result = await pool.query(
    `
      SELECT pm.role
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
    [organizationId, userId, projectId],
  );

  if (result.rows.length === 0) {
    return {
      isMember: false,
      isAdmin: false,
      role: null,
    };
  }

  const { role } = result.rows[0];

  return {
    isMember: true,
    isAdmin: role === "admin",
    role,
  };
}

/**
 * @example 
 * const { isMember } = await checkTeamMembership(USERID, organizationId, teamId);
 * if (!isMember) {
      return res.status(403).json({
        error: true,
        message: "You are not a member of this organization",
      });
    }
  const { isMember , isAdmin } = await checkTeamMembership(USERID, organizationId, teamId);
    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        message: "Only organization admins can perform this action",
      });
    }
 * @returns isMember, isAdmin, role
 */
export async function checkTeamMembership(userId, organizationId, teamId) {
  const result = await pool.query(
    `
      SELECT tm.role
      FROM team_members tm INNER JOIN team t ON t.id = tm.team_id
      WHERE t.id=$1 AMD t.organization_id = $2
        AND tm.user_id = $3
    `,
    [teamId, organizationId, userId],
  );

  if (result.rows.length === 0) {
    return {
      isMember: false,
      isAdmin: false,
      role: null,
    };
  }

  const { role } = result.rows[0];

  return {
    isMember: true,
    isAdmin: role === "admin",
    role,
  };
}
