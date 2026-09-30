import apiFetch from "@/api/auth/client.ts";

async function orgStatsApi(organizationId: number) {
  try {
    const result = await apiFetch("/api/v1/stats/org", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
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
export default orgStatsApi;
