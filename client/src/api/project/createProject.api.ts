import apiFetch from "@/api/auth/client.ts";

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
          "All fields are required i.e slug, name, description, startDate, targetDate, project_status",
      };
    }

    const response = await apiFetch("/api/v1/project/create-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug,
        name,
        project_status,
        description,
        startDate,
        targetDate,
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
