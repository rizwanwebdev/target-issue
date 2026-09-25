import OrganizationProjects from "@/components/dashboard/utils/OrganizationProjects.tsx";

import { useOutletContext, useParams } from "react-router-dom";
import type { Organization } from "@/api/org/getOrg.api";
import CreateProjectForm from "@/components/dashboard/utils/CreateProjectForm.tsx";

type OrganizationContext = {
  organization: Organization;
};

const OrganizationProjectsPage = () => {
  const { slug } = useParams<{ slug: string }>();

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

          <button type="button" className="btn btn-primary w-fit">
            + Create Project
          </button>
        </div>
      </section>
      {isAdmin && slug && <CreateProjectForm slug={slug} />}
      {slug && <OrganizationProjects slug={slug} />}
      {/* projects */}
    </>
  );
};
export default OrganizationProjectsPage;
