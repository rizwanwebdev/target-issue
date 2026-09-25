import OrganizationProjects from "@/components/dashboard/utils/OrganizationProjects.tsx";

import { useOutletContext, useParams } from "react-router-dom";
import type { Organization } from "@/api/org/getOrg.api";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import { useState } from "react";

type OrganizationContext = {
  organization: Organization;
};

const OrganizationProjectsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const { organization } = useOutletContext<OrganizationContext>();

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
              fetchAgain={fetchAgain}
            />
          )}
        </div>
      </section>

      {slug && (
        <OrganizationProjects
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
