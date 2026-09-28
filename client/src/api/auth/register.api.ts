async function register(
  name: string,
  username: string,
  email: string,
  password: string,
) {
  if (!name || !username || !email || !password) {
    return { error: true, message: "All Fields are required" };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const USERNAME_FORMAT = /^[a-z0-9_]{4,25}$/;
  if (!emailRegex.test(email)) {
    return { error: true, message: "Invalid Email" };
  }
  if (!USERNAME_FORMAT.test(username)) {
    return {
      error: true,
      message:
        "Username must be 4–25 characters and contain only lowercase letters, numbers, and underscores.",
    };
  }
  try {
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        username: username,
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
