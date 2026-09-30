import apiFetch from "@/api/auth/client.ts";

async function createTeam(
  organizationId: number,
  slug: string,
  name: string,
  description: string,
  color: string,
) {
  try {
    if (!organizationId || !name || !description || !color || !slug) {
      return {
        error: true,
        message:
          "All fileds are required i.e organization Id, slug, name, description, color",
      };
    }
    const result = await apiFetch("/api/v1/team/create-team", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        slug: slug,
        name: name,
        description: description,
        color: color,
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
export default createTeam;
