import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
const HomePage = () => {
  const { user, authenticated } = useAuth();
  return (
    <>
      <title>Target Issue</title>

      <div className="flex flex-col justify-center items-center min-h-screen">
        {!authenticated && (
          <Link to="/register" className="border rounded p-3">
            Register
          </Link>
        )}

        {authenticated && (
          <div className="flex flex-col gap-2 items-center">
            <p>Dashboard</p>

            <p>{user?.fullName}</p>

            <Link
              to="/dashboard"
              className="bg-indigo-600 text-white px-3 py-2 rounded-xl cursor-pointer"
            >
              dashboard
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
export default HomePage;
