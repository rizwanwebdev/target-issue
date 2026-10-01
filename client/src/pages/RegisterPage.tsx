import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import checkPasswordStrength, {
  type PasswordCheckRule,
  type PasswordStrengthResult,
} from "@/utils/CheckStrongPassowrd";
import { useToast } from "@/context/ToastProvider.tsx";
import apiRequest from "@/api/apiRequest";

// Readable messages for each validation rule key
const PASSWORD_ERROR_MESSAGES: Record<PasswordCheckRule, string> = {
  length: "At least 8 characters required",
  hasLower: "Include at least one lowercase letter",
  hasUpper: "Include at least one uppercase letter",
  hasDigit: "Include at least one number",
  hasSpecial: "Include at least one special character (@$!%*?&)",
};
const USERNAME_FORMAT = /^[a-z0-9_]{4,25}$/;
const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userNameError, setUserNameError] = useState<string>("");
  // 1. Fully controlled form state
  const INITIAL_FORM_STATE = {
    name: "",
    username: "",
    email: "",
    password: "",
    terms: false,
  };
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const { addToast } = useToast();
  // 2. Strongly typed validation state
  const [passwordCheck, setPasswordCheck] =
    useState<PasswordStrengthResult | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    let inputValue: string | boolean = type === "checkbox" ? checked : value;

    if (name === "username" && typeof inputValue === "string") {
      inputValue = inputValue
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .replace(/_+/g, "_")
        .slice(0, 25);
      if (inputValue.length !== 0 && !USERNAME_FORMAT.test(inputValue)) {
        setUserNameError(
          "Invalid Username, examples username: user_name or username, userna_me",
        );
      } else {
        setUserNameError("");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    if (name === "password" && typeof inputValue === "string") {
      if (inputValue.length === 0) {
        setPasswordCheck(null);
      } else {
        setPasswordCheck(checkPasswordStrength(inputValue));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Prevent submit if password invalid
    if (formData.password && passwordCheck && !passwordCheck.isValid) {
      return;
    }
    if (formData.username && !USERNAME_FORMAT.test(formData.username)) {
      setUserNameError(
        "Invalid Username, examples username: user_name or username, userna_me",
      );
      return;
    }

    try {
      setLoading(true);

      const email = formData.email;
      if (!EMAIL_REGEX.test(email)) {
        addToast("Invalid Email", "error");
        return;
      }

      const result = await apiRequest({
        method: "POST",
        endpoint: "/auth/register",
        body: {
          name: formData.name,
          email: email,
          password: formData.password,
          username: formData.username,
        },
      });

      if (result?.error) {
        return addToast(result.message, "error");
      }
      addToast(result.message, "success");
      setFormData(INITIAL_FORM_STATE);
      setUserNameError("");
      setPasswordCheck(null);
      navigate(`/verify-otp?token=${result?.verificationToken}&type=direct`);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Register| Target Issue</title>

      <main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md w-full">
          <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-6">
            <h1 className="text-slate-900 text-center text-2xl font-bold">
              Create an account
            </h1>

            <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  minLength={4}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Your Name"
                  required
                  className="site-input-styles"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  @username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  minLength={4}
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter Your Desired User Name"
                  pattern="^[a-z0-9_]{4,25}$"
                  title="Username must be 4–25 characters and contain only lowercase letters, numbers, and underscores."
                  required
                  className="site-input-styles"
                />
                {userNameError && (
                  <p className="text-sm text-red-500 mt-1">{userNameError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@readymadeui.com"
                  required
                  className="site-input-styles"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    autoComplete="password"
                    minLength={8}
                    required
                    className="px-3 py-2.5 pr-10 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  >
                    {showPassword ? (
                      /* Eye Slash Icon (Hide) */
                      <svg
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      /* Eye Icon (Show) */
                      <svg
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12c1.274 4.057 5.065 7 9.542 7 4.477 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7-4.477 0-8.268 2.943-9.542 7z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Show errors only when input is not empty AND validation failed */}
                {passwordCheck && !passwordCheck.isValid && (
                  <ul className="mt-2 text-xs text-red-600 space-y-1 list-disc list-inside">
                    {passwordCheck.errors.map((errKey) => (
                      <li key={errKey}>{PASSWORD_ERROR_MESSAGES[errKey]}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-start flex-wrap gap-2">
                <label className="flex cursor-pointer items-center group has-[input:checked]:text-slate-900">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    required
                    className="sr-only"
                  />
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded outline-1 outline-slate-300 bg-white group-has-[input:checked]:bg-blue-600 group-has-[input:checked]:outline-blue-600 group-focus-within:outline-2 group-focus-within:outline-blue-600"
                    aria-hidden="true"
                  >
                    <svg
                      className="size-3 text-white opacity-0 group-has-[input:checked]:opacity-100"
                      viewBox="0 0 12 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 5l3 3 7-7" />
                    </svg>
                  </span>
                  <span className="ml-3 text-sm text-slate-700">
                    I accept the
                  </span>
                </label>
                <Link
                  to="#"
                  className="ml-1 text-sm font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Terms and Conditions
                </Link>
              </div>

              <button
                disabled={
                  loading || (!!passwordCheck && !passwordCheck.isValid)
                }
                type="submit"
                className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create an account"}
              </button>
            </form>

            <div className="mt-6 text-slate-900 text-sm text-center">
              Already have an account?
              <Link
                to="/login"
                className="text-blue-700 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default RegisterPage;
