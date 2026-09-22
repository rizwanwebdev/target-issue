import { Aside } from "../components/Aside.tsx";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
const DashboardLayout = () => {
  const { loading, authenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <div className="flex flex-row">
        <Aside />
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
