import { Navigate, Outlet, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Aside } from "./Aside.tsx";
import DashHeader from "./DashHeader.tsx";
const DashboardLayout = () => {
  const { loading, authenticated } = useAuth();
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Aside slug={slug} projectId={projectId} />

      <div className="flex-1 min-w-0">
        <DashHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
