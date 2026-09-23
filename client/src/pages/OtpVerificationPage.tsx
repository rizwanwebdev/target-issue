import { useSearchParams } from "react-router-dom";
import OtpVerification from "@/components/utils/OtpVerification.tsx";
import { useToast } from "@/context/ToastProvider.tsx";
import verifyOtp from "@/api/auth/verifyOtp.api.ts";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const OtpVerificationPage = () => {
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      addToast("Missing Token Click the link in your email", "warning");
      return;
    }
  }, [token, type]);

  const handleOtpVerification = async (otp: string) => {
    try {
      if (!token) {
        addToast("Missing Token Click the link in your email", "warning");
        return;
      }
      addToast(`Verifying OTP: ${otp}`, "info");

      const result = await verifyOtp(otp, token);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        addToast(error.message, "error");
      } else {
        addToast("An unexpected error occurred", "error");
      }
    }
  };
  return (
    <>
      <title>OTP Verification| Target Issue</title>

      <OtpVerification
        length={6}
        verificationToken={token}
        onVerify={handleOtpVerification}
      />
    </>
  );
};
export default OtpVerificationPage;
