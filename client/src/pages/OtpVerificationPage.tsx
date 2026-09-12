import { useSearchParams } from "react-router-dom";
import OtpVerification from "../components/OtpVerification.tsx";
import { useToast } from "../context/ToastProvider.tsx";
import verifyOtp from "../api/verifyOtp.api.ts";
import { useNavigate } from "react-router-dom";

const OtpVerificationPage = () => {
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  console.log(token, type);
  const navigate = useNavigate();

  const handleOtpVerification = async (otp: string) => {
    try {
      addToast(`Verifying OTP: ${otp}`, "info");

      const result = await verifyOtp(otp, token);
      if (result.error) {
        addToast(result.message);
        return;
      }
      addToast(result.message);
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        addToast(error.message);
      } else {
        addToast("An unexpected error occurred");
      }
    }
  };
  return (
    <>
      <OtpVerification
        length={6}
        verificationToken={token}
        onVerify={handleOtpVerification}
      />
    </>
  );
};
export default OtpVerificationPage;
