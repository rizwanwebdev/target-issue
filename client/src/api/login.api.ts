async function login(email: string, password: string) {
  if (!email || !password) {
    return "All Fields are required";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Invalid Email";
  }

  try {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    return await res.json();
  } catch (err) {
    return err instanceof Error ? err.message : "Something went wrong";
  }
}

export default login;
