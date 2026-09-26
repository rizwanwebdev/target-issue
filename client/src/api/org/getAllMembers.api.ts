import apiFetch from "@/api/auth/client.ts";

async function getAllMembersApi(
  organizationId: number,
  page: number,
  limit: number,
  projectId?: number,
) {
  try {
    if (!organizationId) {
      return {
        error: true,
        message: "Organization Id not found",
      };
    }
    const res = await apiFetch("/api/v1/org/all-members", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        page: page,
        limit: limit,
        projectId: projectId,
      }),
    });

    return await res.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export default getAllMembersApi;
