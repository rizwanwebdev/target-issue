import { useParams } from "react-router-dom";
import OrganizationMembers from "../components/utils/OrganizationMembers.tsx";
const OrganizationMemebersPage = () => {
  const { slug } = useParams<{ slug: string }>();
  return (
    <main className="bg-gray-50 p-4 md:px-8">
      <div className="min-h-screen flex flex-col items-center gap-4">
        <div className="p-4 border w-full">
          {slug && <OrganizationMembers slug={slug} />}
        </div>
      </div>
    </main>
  );
};

export default OrganizationMemebersPage;
