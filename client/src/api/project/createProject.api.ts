async function createProject(
  slug: string,
  name: string,
  description: string,
  startDate: string,
  targetDate: string,
  project_status: string,
) {
  try {
    if (
      !slug ||
      !name ||
      !description ||
      !startDate ||
      !targetDate ||
      !project_status
    ) {
      return {
        error: true,
        message:
          "All fileds are required i.e slug, name, description, startDate, targetDate, project_status",
      };
    }
    const result = await fetch("/api/v1/project/create-project", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        name: name,
        project_status: project_status,
        description: description,
        startDate: startDate,
        targetDate: targetDate,
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
export default createProject;
