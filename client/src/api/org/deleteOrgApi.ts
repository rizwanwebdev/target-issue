import apiFetch from "@/api/auth/client.ts";
type Body = {
  endpoint: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?:
    | {
        teamId?: string;
        organizationId?: number;
        projectId?: number;
        issueId?: number;
      }
    | object;
};
async function deleteOrgApi(data: Body) {
  try {
    const res = await apiFetch(`/api/v1${data.endpoint}`, {
      method: data.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data.body }),
    });
    return await res.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default deleteOrgApi;
