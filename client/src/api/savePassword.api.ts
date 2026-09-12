async function savePassword(email: string, otp: string, password: string) {
  if (!email || !otp || !password) {
    return { error: true, message: "All Fields are required" };
  }
  if (otp.length !== 6) {
    return { error: true, message: "Invalid OTP, It should be 6 digits" };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { error: true, message: "Invalid Email" };
  }
  console.log(email, otp, password);

  try {
    const res = await fetch("/api/v1/auth/save-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp: otp,
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
