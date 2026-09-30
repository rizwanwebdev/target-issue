import apiFetch from "@/api/auth/client.ts";

async function logoutAll() {
  try {
    const res = await apiFetch("/api/v1/auth/logout-all", {
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

export default logoutAll;
