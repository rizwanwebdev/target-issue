async function register(name: string, email: string, password: string) {
  if (!name || !email || !password) {
    return { error: true, message: "All Fields are required" };
  }

  try {
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        email: email,
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

export default register;
