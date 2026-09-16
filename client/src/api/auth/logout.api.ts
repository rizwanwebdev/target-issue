async function logoutApi() {
  try {
    const res = await fetch("/api/v1/auth/logout", {
      credentials: "include",
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
    };
  }
}

export default logoutApi;
