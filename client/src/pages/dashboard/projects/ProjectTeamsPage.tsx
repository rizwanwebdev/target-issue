import { useOutletContext, useParams } from "react-router-dom";
import OragnizationTeams from "@/components/dashboard/utils/OragnizationTeams.tsx";
import { useState } from "react";
import CreateTeamModal from "@/components/modals/CreateTeamModal";

import type { ProjectOutletContext } from "@/types/ProjectOutletContext";

const ProjectTeamsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { organization, project } = useOutletContext<ProjectOutletContext>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const isAdmin = organization.role === "admin";
  return (
    <>
      <title>Teams | Assing & Manage</title>
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">Project Teams</h1>
            <p className="text-sm text-gray-500">
              {isAdmin
                ? "Manage & view all teams in this project."
                : "Teams in this project."}
            </p>
          </div>

          {isAdmin && slug && (
            <CreateTeamModal
              organizationId={organization.id}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          )}
        </div>
      </section>
      {slug && (
        <OragnizationTeams
          organizaionId={organization.id}
          projectId={project.id}
          slug={slug}
          fetchAgain={fetchAgain}
        />
      )}
    </>
  );
};
export default ProjectTeamsPage;
