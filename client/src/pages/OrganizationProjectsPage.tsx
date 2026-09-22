import { useParams } from "react-router-dom";
import OrganizationProjects from "../components/utils/OrganizationProjects.tsx";
const OrganizationProjectsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  return (
    <main className="bg-gray-50 p-4 md:px-8">
      <div className="min-h-screen flex flex-col items-center gap-4">
        <div className="p-4 border w-full">
          {slug && <OrganizationProjects slug={slug} />}
        </div>
      </div>
    </main>
  );
};

export default OrganizationProjectsPage;
