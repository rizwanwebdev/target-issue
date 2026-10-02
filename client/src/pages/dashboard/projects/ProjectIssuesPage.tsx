import { useOutletContext, useParams } from "react-router-dom";

import type { ProjectOutletContext } from "@/types/ProjectOutletContext";
import OrganizationIssues from "@/components/dashboard/utils/OrganizationIssues";
import CreateIssueModal from "@/components/modals/CreateIssueModal";
import { useState } from "react";

const ProjectIssuesPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [fetchAgain, setFetchAgain] = useState(false);
  const { organization, project } = useOutletContext<ProjectOutletContext>();
  return (
    <>
      <title>Issues | Create & Manage</title>
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">
              This Project Issues
            </h1>
            <p className="text-sm text-gray-500">
              Issues belonging to this project.
            </p>
          </div>
          <CreateIssueModal
            setFetchAgain={setFetchAgain}
            organizationId={organization.id}
            projectId={project.id}
          />
        </div>
      </section>
      <div className="flex flex-col gap-4 ">
        {slug && (
          <OrganizationIssues
            projectId={project.id}
            slug={slug}
            fetchAgain={fetchAgain}
            organizationId={organization.id}
            setFetchAgain={setFetchAgain}
          />
        )}
      </div>
    </>
  );
};
export default ProjectIssuesPage;
