import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
const HomePage = () => {
  const { user, authenticated } = useAuth();
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p>Dashboard</p>

        <p>{user?.fullName}</p>

        <Link
          to="/dashboard"
          className="bg-indigo-600 text-white px-3 py-2 rounded-xl cursor-pointer"
        >
          dashboard
        </Link>
        {!authenticated && <Link to="/register">Register</Link>}
      </div>
    </>
  );
};
export default HomePage;
