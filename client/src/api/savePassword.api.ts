async function savePassword(token: string, password: string) {
  if (!token || !password) {
    return { error: true, message: "All Fields are required" };
  }

  console.log(token, password);

  try {
    const res = await fetch("/api/v1/auth/save-password", {
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
