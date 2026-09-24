import apiFetch from "@/api/auth/client.ts";

async function acceptInvitation(token: string) {
  try {
    const res = await apiFetch("/api/v1/org/accept-invitation", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    });
    return await res.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default acceptInvitation;
