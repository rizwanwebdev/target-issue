import pool from "../db/connect.js";

export async function saveActivity({
  organizationId,
  projectId = null,
  actorId,
  message,
}) {
  try {
    await pool.query(
      `
        INSERT INTO activity (
          organization_id,
          project_id,
          actor_id,
          message
        )
        VALUES ($1, $2, $3, $4)
      `,
      [organizationId, projectId, actorId, message],
    );
  } catch (error) {
    console.error("Failed to save activity:", error);
  }
}
