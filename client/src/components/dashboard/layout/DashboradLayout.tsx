import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.tsx";
import { Aside } from "./Aside.tsx";
import DashHeader from "./DashHeader.tsx";
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
      <div className="flex h-screen overflow-hidden">
        <Aside slug={slug} />
        <div className="flex-1 min-w-0 overflow-y-auto p-6">
          <DashHeader />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
