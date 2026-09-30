import apiFetch from "@/api/auth/client";
async function GetRecentProjectActivitiesApi(
  organizationId: number,
  projectId: number,
) {
  try {
    if (!organizationId || !projectId) {
      return {
        error: true,
        message: "organization Id and project Id is required",
      };
    }
    const result = await apiFetch("/api/v1/activity/project", {
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

export default GetRecentProjectActivitiesApi;
