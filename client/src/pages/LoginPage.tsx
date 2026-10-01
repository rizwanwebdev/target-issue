import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastProvider.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import apiRequest from "@/api/apiRequest";
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      setLoading(true);

      const formData = new FormData(form);
      const credentials = Object.fromEntries(formData.entries());
      const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const email = String(credentials.email);
      if (!EMAIL_REGEX.test(email)) {
        addToast("Invalid Email", "error");
        return;
      }
      const result = await apiRequest({
        method: "POST",
        endpoint: "/auth/login",
        body: {
          email: email,
          password: String(credentials.password),
        },
      });

      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      form.reset();
      await refreshUser();
      navigate("/dashboard", { replace: true });
      addToast(result.message, "success");
    } catch (error: unknown) {
      if (error instanceof Error) {
        addToast(error.message, "error");
      } else {
        addToast("An unexpected error occurred", "error");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <title>Login| Target Issue</title>

      <main className="px-4 md:px-8">
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
              <h1 className="text-slate-900 text-center text-3xl font-bold">
                Sign in
              </h1>

              <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
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
                    placeholder="john@readymadeui.com"
                    required
                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
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
                </div>

                <div className="flex items-start flex-wrap gap-2">
                  <label className="flex items-center group has-[input:checked]:text-slate-900">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
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
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 disabled:bg-blue-500 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Sign in
                </button>

                <div className="text-slate-900 text-sm text-center">
                  Don't have an account?
                  <Link
                    to="/register"
                    className="text-blue-700 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default LoginPage;
