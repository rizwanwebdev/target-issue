import DisplayMembers from "@/components/dashboard/utils/DisplayMembers";

import { useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import type { TeamOutletContext } from "@/types/OutletContexts";
import AssignMembersModal from "@/components/modals/AssignMembersModal";

const TeamMembersPage = () => {
  const { slug } = useParams<{
    slug: string;
  }>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);

  const { organization, project, team } = useOutletContext<TeamOutletContext>();

  console.log(team);
  const isAdmin = team.role === "admin";
  useEffect(() => {
    document.title = team.name ? team.name + " | Team" : "Team";
  }, [team.name]);
  return (
    <>
      <title>Team | Create & Manage</title>
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">Team Members</h1>
            <p className="text-sm text-gray-500">
              {isAdmin
                ? "Manage & view all members in this Team."
                : "Members in this Team."}
            </p>
          </div>

          {isAdmin && slug && (
            <AssignMembersModal
              fetchMembersUrl="/org/all-members"
              assignMembersUrl="/team/assign-members"
              organizationId={organization.id}
              projectId={project.id}
              teamId={team.id}
              setFetchAgain={setFetchAgain}
            />
          )}
        </div>
      </section>
      {slug && (
        <DisplayMembers
          fetchUrl="/team/members"
          removeUrl="/team/remove-member"
          leaveUrl="/team/leave"
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
          teamId={team.id}
          organizationId={organization.id}
        />
      )}
      {/* projects */}
    </>
  );
};
export default TeamMembersPage;
