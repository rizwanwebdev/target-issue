import apiFetch from "@/api/auth/client.ts";

async function logoutApi() {
  try {
    const res = await apiFetch("/api/v1/auth/logout", {
      credentials: "include",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export default logoutApi;
