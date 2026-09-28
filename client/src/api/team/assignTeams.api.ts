import apiFetch from "@/api/auth/client";

async function assignTeams(
  teamIds: number[],
  organizationId: number,
  projectId: number,
) {
  if (teamIds.length === 0 || !organizationId || !projectId) {
    return {
      error: true,
      message:
        "Team id, organization Id and project Id is required to assign a team",
    };
  }
  try {
    const result = await apiFetch("/api/v1/team/assign-teams", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        projectId: projectId,
        teamIds: teamIds,
      }),
    });
    return await result.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default assignTeams;
