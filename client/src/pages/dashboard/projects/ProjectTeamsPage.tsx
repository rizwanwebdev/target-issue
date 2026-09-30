import { useOutletContext } from "react-router-dom";
import DisplayTeams from "@/components/dashboard/utils/DisplayTeams";
import { useEffect, useState } from "react";

import type { ProjectOutletContext } from "@/types/ProjectOutletContext";
import AssignTeamModal from "@/components/modals/AssignTeamsModal";
import type { Team } from "@/types/Team";
import getTeams from "@/api/team/getTeams.api";
import { useToast } from "@/context/ToastProvider";

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
      const result = await getTeams(organization.id, project.id);

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
      <DisplayTeams teams={teams} />
    </>
  );
};
export default ProjectTeamsPage;
