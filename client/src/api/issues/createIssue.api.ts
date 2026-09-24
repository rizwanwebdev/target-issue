async function createIssue(
  organizationId: number,
  projectId: number,
  name: string,
  description: string,
  due_date: string,
  issue_status: string,
  priority: string,
  severity: string,
) {
  try {
    if (
      !organizationId ||
      !name ||
      !description ||
      !projectId ||
      !due_date ||
      !issue_status ||
      !priority ||
      !severity
    ) {
      return {
        error: true,
        message:
          "All fileds are required i.e organizationId, name, description, projectId, due_date, issue_status, priority, severity",
      };
    }
    const result = await fetch("/api/v1/issues/create-issue", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        projectId: projectId,
        name: name,
        description: description,
        due_date: due_date,
        issue_status: issue_status,
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
