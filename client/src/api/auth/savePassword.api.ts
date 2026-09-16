async function savePassword(token: string, password: string) {
  if (!token || !password) {
    return { error: true, message: "All Fields are required" };
  }

  try {
    const res = await fetch("/api/auth/save-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        password: password,
      }),
    });
    return await res.json();
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

export default savePassword;
