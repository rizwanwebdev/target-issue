import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";

const NotAuthorized = () => {
  const { loading, authenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default NotAuthorized;
