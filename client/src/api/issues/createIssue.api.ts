import apiFetch from "@/api/auth/client.ts";

async function createIssue(
  organizationId: number,
  projectId: number,
  title: string,
  description: string,
  due_date: string,
  priority: string,
  severity: string,
) {
  try {
    if (
      !organizationId ||
      !title ||
      !description ||
      !projectId ||
      !due_date ||
      !priority ||
      !severity
    ) {
      return {
        error: true,
        message:
          "All fileds are required i.e organizationId, title, description, projectId, due_date, priority, severity",
      };
    }
    const result = await apiFetch("/api/v1/issues/create-issue", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        projectId: projectId,
        title: title,
        description: description,
        due_date: due_date,
        priority: priority,
        severity: severity,
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
export default createIssue;
