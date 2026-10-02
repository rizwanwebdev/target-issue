import OrganizationMembers from "@/components/dashboard/utils/OrganizationMembers.tsx";

import { useOutletContext, useParams } from "react-router-dom";
import { useState } from "react";

import type { ProjectOutletContext } from "@/types/ProjectOutletContext";
import AssignMembersModal from "@/components/modals/AssignMembersModal";

const ProjectMembersPage = () => {
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);

  const { organization, project } = useOutletContext<ProjectOutletContext>();

  const isAdmin = organization.role === "admin";

  return (
    <>
      <title>Members | Create & Manage</title>
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">Project Members</h1>
            <p className="text-sm text-gray-500">
              {isAdmin
                ? "Manage & view all members in this Project."
                : "Members in this Project."}
            </p>
          </div>

          {isAdmin && slug && (
            <AssignMembersModal
              endpoint="/project/assign-members"
              organizationId={organization.id}
              projectId={project.id}
              setFetchAgain={setFetchAgain}
            />
          )}
        </div>
      </section>
      {slug && (
        <OrganizationMembers
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
          projectId={project.id}
          slug={slug}
          organizationId={organization.id}
          projectSlug={projectId}
        />
      )}
      {/* projects */}
    </>
  );
};
export default ProjectMembersPage;
