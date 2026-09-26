import apiFetch from "@/api/auth/client.ts";

export type Team = {
  team_id: string;
  id: number;
  name: string;
  description: string;
  organization_id: number;
  role: string;
  color: string;
  user_id: number;
};
async function getTeams(organizationId: number, projectId: number | undefined) {
  if (!organizationId) {
    return {
      error: true,
      message: "organization Id is required to find Teams",
    };
  }
  try {
    const result = await apiFetch("/api/v1/team/get-teams", {
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
  } catch (error: any) {
    return { error: true, message: error.message };
  }
}
export default getTeams;
