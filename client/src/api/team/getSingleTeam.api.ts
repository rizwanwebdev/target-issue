import apiFetch from "@/api/auth/client";

async function getSingleTeam(teamId: string, organizationId: number) {
  console.log(teamId, organizationId, "api");
  if (!teamId || !organizationId) {
    return {
      error: true,
      message: "Team id and organizationId is required to find a team",
    };
  }
  try {
    const result = await apiFetch("/api/v1/team/team", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        teamId: teamId,
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
export default getSingleTeam;
