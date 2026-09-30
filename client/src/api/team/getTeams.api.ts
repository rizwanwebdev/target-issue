import apiFetch from "@/api/auth/client.ts";

async function getTeams(organizationId: number, projectId?: number) {
  if (!organizationId) {
    return {
      error: true,
      message: "organization Id is required to find Teams",
    };
  }
  try {
    const result = await apiFetch("/api/v1/team/get-teams", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        projectId: projectId,
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
export default getTeams;
