import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Authorize = () => {
  const { loading, authenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default Authorize;
