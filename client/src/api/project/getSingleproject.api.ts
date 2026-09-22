export type Project = {
  id: number;
  name: string;
  description: string;
  organization_id: number;
  start_date: string;
  status: string;
  target_date: string;
  created_at: string;
  created_by: number;
  updated_at: string;
};

async function getSingleproject(projectId: number, slug: string) {
  if (!projectId || !slug) {
    return {
      error: true,
      message: "Team id and Slug is required to find a project",
    };
  }
  console.log("adpi", projectId, slug);
  try {
    console.log("try", projectId, slug);
    const result = await fetch("/api/v1/project/project", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        projectId: projectId,
      }),
    });
    return await result.json();
  } catch (error) {
    return {
      error: true,
      message: "Something Went Wrong",
    };
  }
}
export default getSingleproject;
