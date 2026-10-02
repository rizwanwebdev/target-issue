import { useOutletContext } from "react-router-dom";
import DisplayTeams from "@/components/dashboard/utils/DisplayTeams";
import { useState } from "react";

import type { ProjectOutletContext } from "@/types/ProjectOutletContext";
import AssignTeamsModal from "@/components/modals/AssignTeamsModal";

const ProjectTeamsPage = () => {
  const { organization, project } = useOutletContext<ProjectOutletContext>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const isAdmin = organization.role === "admin";

  return (
    <>
      <title>Teams | Assign & Manage</title>
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
          {isAdmin && (
            <AssignTeamsModal
              projectId={project.id}
              organizationId={organization.id}
              setFetchAgain={setFetchAgain}
            />
          )}
        </div>
      </section>
      <DisplayTeams
        organizationId={organization.id}
        projectId={project.id}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </>
  );
};
export default ProjectTeamsPage;
