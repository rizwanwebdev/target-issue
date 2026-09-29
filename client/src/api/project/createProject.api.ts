import apiFetch from "@/api/auth/client.ts";

async function createProject(
  organizationId: number,
  slug: string,
  name: string,
  description: string,
  startDate: string,
  targetDate: string,
  project_status: string,
) {
  try {
    if (
      !organizationId ||
      !name ||
      !description ||
      !startDate ||
      !targetDate ||
      !project_status ||
      !slug
    ) {
      return {
        error: true,
        message:
          "All fields are required i.e organizationId, name, slug, description, startDate, targetDate, project_status",
      };
    }

    const response = await apiFetch("/api/v1/project/create-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        slug: slug,
        name: name,
        project_status: project_status,
        description: description,
        startDate: startDate,
        targetDate: targetDate,
      }),
    });

    return await response.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export default createProject;
