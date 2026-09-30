import apiFetch from "@/api/auth/client.ts";

async function getAllIssues(
  organizationId: number,
  page: number,
  projectId?: number,
) {
  try {
    if (!organizationId) {
      return {
        error: true,
        message: "organization Id is required to find issues",
      };
    }
    const result = await apiFetch("/api/v1/issues/get-issues", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        page: page,
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
export default getAllIssues;
