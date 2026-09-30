import apiFetch from "@/api/auth/client.ts";

async function recentActivitiesByMe() {
  try {
    const result = await apiFetch("/api/v1/activity/by-me", {
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
export default recentActivitiesByMe;
