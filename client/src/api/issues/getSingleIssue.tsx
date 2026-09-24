export type Issue = {
  organizationId: number;
  projectId: number;
  name: string;
  description: string;
  due_date: string;
  issue_status: string;
  priority: string;
  severity: string;
};
async function getAllIssues(organizationId: number) {
  try {
    if (!organizationId) {
      return {
        error: true,
        message: "Organization Id is required to find issues,",
      };
    }
    const result = await fetch("/api/v1/issues/get-issues", {
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
export default getAllIssues;
