import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
const HomePage = () => {
  const { user, authenticated } = useAuth();
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Link to="/register" className="border rounded p-3">
          Register
        </Link>

        {authenticated && (
          <div>
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
