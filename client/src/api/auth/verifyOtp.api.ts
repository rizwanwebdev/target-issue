async function verifyOtp(otp: string, token: string | null) {
  if (!otp) {
    return { error: true, message: "Missing OTP" };
  }

  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp,
        verificationToken: token,
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

export default verifyOtp;
