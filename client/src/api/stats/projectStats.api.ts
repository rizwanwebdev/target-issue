import apiFetch from "@/api/auth/client.ts";

async function projectStatsApi(organizationId: number, projectId: number) {
  try {
    const result = await apiFetch("/api/v1/stats/project", {
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
export default projectStatsApi;
