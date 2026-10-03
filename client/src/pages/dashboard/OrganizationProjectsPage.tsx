import OrganizationProjects from "@/components/dashboard/utils/OrganizationProjects.tsx";

import { useOutletContext, useParams } from "react-router-dom";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import { useState } from "react";

import type { OrganizationOutletContext } from "@/types/OrganizationOutletContext";

const OrganizationProjectsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const { organization } = useOutletContext<OrganizationOutletContext>();

  const isAdmin = organization.role === "admin";

  return (
    <>
      <title>Projects | Create & Manage</title>
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">
              Organizations Projects
            </h1>
            <p className="text-sm text-gray-500">
              {isAdmin
                ? "Manage & view all projects in this organization."
                : "Projects in this organization."}
            </p>
          </div>

          {isAdmin && slug && (
            <CreateProjectModal
              organizationId={organization.id}
              setFetchAgain={setFetchAgain}
            />
          )}
        </div>
      </section>

      {slug && (
        <OrganizationProjects
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
          slug={slug}
          organizationId={organization.id}
        />
      )}
      {/* projects */}
    </>
  );
};
export default OrganizationProjectsPage;
