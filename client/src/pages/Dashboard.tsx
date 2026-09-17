import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastProvider.tsx";
import { useAuth } from "../context/AuthContext.tsx";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();

    if (result.error) {
      addToast(result.message, "error");
      return;
    }

    addToast(result.message, "success");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col justify-center gap-4 items-center min-h-screen">
      <p>Dashboard</p>

      <p>{user?.fullName}</p>

      <Link
        to="/dashboard/organizations"
        className="text-indigo-600 cursor-pointer"
      >
        Organizations
      </Link>

      <button
        onClick={handleLogout}
        className="bg-indigo-600 text-white px-3 py-2 rounded-xl cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
