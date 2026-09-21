export type Project = {
  description: string;
  id: number;
  name: string;
  organization_id: number;
  project_id: number;
  role: string;
  start_date: string;
  status: string;
  target_date: string;
  user_id: number;
};
async function getProjects(slug: string) {
  if (!slug) {
    return { error: true, message: "Slug is required to find projects" };
  }
  try {
    const result = await fetch("/api/v1/project/get-projects", {
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
    return { error: true, message: error.message };
  }
}
export default getProjects;
