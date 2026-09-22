import { Aside } from "../components/Aside.tsx";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
const DashboardLayout = () => {
  const { loading, authenticated } = useAuth();
  const { slug } = useParams<{ slug: string }>();

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <div className="flex flex-row">
        <Aside slug={slug} />
        <div className="flex-1 w-full p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
