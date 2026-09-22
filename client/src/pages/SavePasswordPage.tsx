import { Link, useNavigate, useSearchParams } from "react-router-dom";
import savePassword from "../api/auth/savePassword.api.ts";
import { useToast } from "../context/ToastProvider.tsx";
import { useState, useEffect } from "react";

const SavePasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const token = searchParams.get("token");
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      addToast("Missing Token. Click the link in your email", "warning");
      return;
    }
  }, [token]);
  const handleSavePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!token) {
        addToast("Missing Token. Click the link in your email", "warning");
        return;
      }
      setErr("");
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const credentials = Object.fromEntries(formData.entries());
      if (
        String(credentials.password) === String(credentials.confirmPassword)
      ) {
        setErr("Password Dose Not Matched");
      }
      const result = await savePassword(token, String(credentials.password));
      if (result.error && result.message.includes("Token")) {
        addToast(result.message, "error");
        navigate("/forgot-password");
        return;
      }
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      navigate("/login");
    } catch (error: any) {
      addToast(error.message, "error");
    } finally {
      setLoading(true);
    }
  };
  return (
    <>
      <title>Save New Password| Target Issue</title>

      <main className="bg-gray-50 px-4 md:px-8">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="max-w-md w-full">
            <Link to="/">
              <img
                src="/target-issue.png"
                alt="logo"
                className="w-14 min-h-14 mb-8 mx-auto block"
              />
            </Link>
            <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-8">
              <h1 className="text-slate-900 text-3xl font-bold">
                Save Your New Password
              </h1>
              <p className="font-light text-sm text-gray-500 mt-2">
                Enter new password here, kindly do not use old password.
              </p>

              <form className="space-y-6 mt-10" onSubmit={handleSavePassword}>
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
                      placeholder="••••••••"
                      minLength={8}
                      onChange={() => setErr("")}
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
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 text-slate-900 font-medium text-sm inline-block"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      minLength={8}
                      onChange={() => setErr("")}
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
                </div>
                {err && (
                  <div>
                    <p className="text-sm text-red-600">{err}</p>
                  </div>
                )}

                <button
                  disabled={loading && !!err}
                  type="submit"
                  className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Reset password
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default SavePasswordPage;
