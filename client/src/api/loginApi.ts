async function login(email: string, password: string) {
  if (!email || !password) {
    return "Both email and password required";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(email)) {
    return "Invalid Email";
  }

  try {
    const res = await fetch("/api/v1/auth/login");
    const result = await res.json();

    if (result.error) {
      return result.message;
    }
    return result.message;
  } catch (err) {
    return err instanceof Error ? err.message : "Something went wrong";
  }
}

export default login;
