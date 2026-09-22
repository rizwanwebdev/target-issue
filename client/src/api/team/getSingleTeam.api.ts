export type Team = {
  id: number;
  color: string;
  name: string;
  description: string;
  organization_id: number;
  created_at: string;
  created_by: number;
};

async function getSingleTeam(teamId: number, slug: string) {
  if (!teamId || !slug) {
    return {
      error: true,
      message: "Team id and Slug is required to find a team",
    };
  }
  console.log("adpi", teamId, slug);
  try {
    console.log("try", teamId, slug);
    const result = await fetch("/api/v1/team/team", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        teamId: teamId,
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
export default getSingleTeam;
