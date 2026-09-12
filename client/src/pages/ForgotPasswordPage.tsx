import { Link } from "react-router-dom";
const ForgotPasswordPage = () => {
  return (
    <>
      <title>Forgot Password</title>
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
                Forgot your password?
              </h1>
              <p className="font-light text-sm text-gray-500 mt-2">
                Don't fret! Just type in your email and we will send you a code
                to reset your password!
              </p>

              <form className="space-y-6 mt-10">
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
                    placeholder="john@readymadeui.com"
                    required
                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                  />
                </div>

                <button
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
export default ForgotPasswordPage;
