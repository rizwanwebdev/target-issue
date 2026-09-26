async function getSingleproject(projectId: number, organizationId: number) {
  if (!projectId || !organizationId) {
    return {
      error: true,
      message: "Team id and organizationId is required to find a project",
    };
  }
  try {
    const result = await fetch("/api/v1/project/project", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        projectId: projectId,
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
export default getSingleproject;
