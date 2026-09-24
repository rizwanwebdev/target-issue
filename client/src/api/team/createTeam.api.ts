import apiFetch from "@/api/auth/client.ts";

async function createTeam(
  slug: string,
  name: string,
  description: string,
  color: string,
) {
  try {
    if (!slug || !name || !description || !color) {
      return {
        error: true,
        message: "All fileds are required i.e slug, name, description, color",
      };
    }
    const result = await apiFetch("/api/v1/team/create-team", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        name: name,
        description: description,
        color: color,
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
export default createTeam;
