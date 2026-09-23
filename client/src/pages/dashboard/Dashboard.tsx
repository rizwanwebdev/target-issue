import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <title>Dashboard | Create & Manage</title>
      <div className="flex flex-row w-full">
        <div className="flex flex-col justify-center flex-1 gap-4 p-4 items-center min-h-screen">
          <p>Dashboard</p>

          <p>{user?.fullName}</p>

          <Link
            to="/dashboard/organizations"
            className="text-indigo-600 cursor-pointer"
          >
            Organizations
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
