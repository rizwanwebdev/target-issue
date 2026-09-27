import apiFetch from "@/api/auth/client";
async function getRecentActivities(organizationId: number) {
  try {
    if (!organizationId) {
      return {
        error: true,
        message: "organization Id and project Id is required",
      };
    }
    const result = await apiFetch("/api/v1/activity/organization", {
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
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
    };
  }
}

export default getRecentActivities;
