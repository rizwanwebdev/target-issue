async function login(email: string, password: string) {
  if (!email || !password) {
    return { error: true, message: "All Fields are required" };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    console.log("here");
    return { error: true, message: "Invalid Email" };
  }
  console.log(email, password);

  try {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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

export default login;
