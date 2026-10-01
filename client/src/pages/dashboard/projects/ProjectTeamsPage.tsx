import { useOutletContext } from "react-router-dom";
import DisplayTeams from "@/components/dashboard/utils/DisplayTeams";
import { useEffect, useState } from "react";

import type { ProjectOutletContext } from "@/types/ProjectOutletContext";
import AssignTeamModal from "@/components/modals/AssignTeamsModal";
import type { Team } from "@/types/Team";
import { useToast } from "@/context/ToastProvider";
import apiRequest from "@/api/apiRequest";

const ProjectTeamsPage = () => {
  const { organization, project } = useOutletContext<ProjectOutletContext>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const isAdmin = organization.role === "admin";
  const [teams, setTeams] = useState<Team[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    if (!organization.id || !project.id) {
      return;
    }

    async function getAll() {
      const result = await apiRequest({
        method: "POST",
        endpoint: "/team/get-teams",
        body: {
          projectId: project.id,
          organizationId: organization.id,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setTeams(result.teams);
    }

    getAll();
  }, [organization.id, project.id, addToast, fetchAgain]);

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
            <AssignTeamModal
              projectId={project.id}
              organizationId={organization.id}
              setFetchAgain={setFetchAgain}
            />
          )}
        </div>
      </section>
      <DisplayTeams setFetchAgain={setFetchAgain} teams={teams} />
    </>
  );
};
export default ProjectTeamsPage;
