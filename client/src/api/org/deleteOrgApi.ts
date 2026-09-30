import apiFetch from "@/api/auth/client.ts";

async function deleteOrgApi(organizationId: number) {
  try {
    const res = await apiFetch("/api/v1/org/delete", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
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
export default deleteOrgApi;
