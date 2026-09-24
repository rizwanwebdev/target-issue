export type Issue = {
  slug: string;
  projectId: number;
  name: string;
  description: string;
  due_date: string;
  issue_status: string;
  priority: string;
  severity: string;
};
async function getAllIssues(slug: string) {
  try {
    if (!slug) {
      return {
        error: true,
        message: "Slug is required to find issues,",
      };
    }
    const result = await fetch("/api/v1/issues/get-issues", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
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
