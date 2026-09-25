import apiFetch from "@/api/auth/client.ts";
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
async function getProjects(organizationId: number) {
  if (!organizationId) {
    return {
      error: true,
      message: "organizationId is required to find projects",
    };
  }
  try {
    const result = await apiFetch("/api/v1/project/get-projects", {
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
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default getProjects;
