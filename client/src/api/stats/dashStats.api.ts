import apiFetch from "@/api/auth/client.ts";

async function dashStatsApi() {
  try {
    const result = await apiFetch("/api/v1/stats/dash", {
      method: "GET",
      credentials: "include",
    });
    return await result.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default dashStatsApi;
