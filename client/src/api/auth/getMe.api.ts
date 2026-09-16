async function getMe() {
  try {
    const response = await fetch("/api/auth/get-me", {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        message: data.message || "Authentication failed",
      };
    }

    return {
      error: false,
      user: data.user,
    };
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export default getMe;
