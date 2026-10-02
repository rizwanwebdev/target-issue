import pool from "../db/connect.js";

/**
 * @example  await saveActivity({organizationId:organizationId,
      projectId:projectId,
      actorId: USERID,
      message: `${messageHere}`,
    });
 */
export async function saveActivity({
  organizationId,
  projectId = null,
  teamId = null,
  actorId,
  message,
}) {
  try {
    await pool.query(
      `
        INSERT INTO activity (
          organization_id,
          project_id,
          team_id,
          actor_id,
          message
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [organizationId, projectId, teamId, actorId, message],
    );
  } catch (error) {
    console.error("Failed to save activity:", error);
  }
}
