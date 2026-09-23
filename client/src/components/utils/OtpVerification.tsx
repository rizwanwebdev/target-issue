import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
  type ClipboardEvent,
  type FormEvent,
} from "react";
import { useToast } from "@/context/ToastProvider.tsx";
interface OtpVerificationProps {
  length?: number;
  verificationToken: string | null;
  onVerify: (otp: string) => void;
}
import resendOtp from "@/api/auth/resendOtp.api.ts";
export default function OtpVerification({
  length = 6,
  onVerify,
  verificationToken,
}: OtpVerificationProps) {
  // Array of strings to track state per box
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { addToast } = useToast();
  // Focus on the first element when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    // Block non-numeric characters
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Snag only the last entered digit to maintain one character per cell
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Forward shift focus if a value is typed
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Backward shift focus on Backspace if cell is currently empty
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Verify regex validity for integers only
    if (!/^\d+$/.test(pastedData)) return;

    const pastedValues = pastedData.split("").slice(0, length);
    const newOtp = [...otp];

    pastedValues.forEach((char, index) => {
      newOtp[index] = char;
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = char;
      }
    });

    setOtp(newOtp);

    // Shift window focus to the absolute end of paste distribution
    const focusIndex = Math.min(pastedValues.length, length - 1);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length === length) {
      onVerify(finalOtp);
    } else {
      addToast("Please complete the OTP fields.");
    }
  };

  const handleResend = async () => {
    if (!verificationToken) {
      addToast("Missing Token", "warning");
    }
    try {
      const result = await resendOtp(verificationToken);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
    } catch (error: any) {
      addToast(error.message, "error");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl  p-8 border border-gray-300 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          OTP Verification
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Please enter the {length}-digit code sent to your Email.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(e, index)
                }
                onPaste={handlePaste}
                required
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold shadow-sm outline-none transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg cursor-pointer disabled:cursor-not-allowed bg-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
          >
            Verify OTP
          </button>
        </form>
        <div className="py-2">
          <p className="text-sm ">
            Didn't received code:&nbsp;
            <button
              onClick={handleResend}
              className="inline font-semibold cursor-pointer hover:scale-105 transition-all duration-200 text-indigo-500 underline"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
