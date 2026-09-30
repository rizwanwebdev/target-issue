import apiFetch from "@/api/auth/client.ts";

async function getSingleIssue(organizationId: number) {
  try {
    if (!organizationId) {
      return {
        error: true,
        message: "Organization Id is required to find issues,",
      };
    }
    const result = await apiFetch("/api/v1/issues/issue", {
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
export default getSingleIssue;
