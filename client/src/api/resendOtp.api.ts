async function resendOtp(token: string | null) {
  if (!token) {
    return { error: true, message: "Missing OTP" };
  }

  try {
    const res = await fetch("/api/v1/auth/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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

export default resendOtp;
