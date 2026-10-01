import { useOutletContext, useParams } from "react-router-dom";
import OragnizationTeams from "@/components/dashboard/utils/DisplayTeams";
import { useEffect, useState } from "react";
import CreateTeamModal from "@/components/modals/CreateTeamModal";

import type { OrganizationOutletContext } from "@/types/OrganizationOutletContext";
import { useToast } from "@/context/ToastProvider";
import getTeams from "@/api/team/getTeams.api";
import type { Team } from "@/types/Team";

const OrganizationTeamsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { organization } = useOutletContext<OrganizationOutletContext>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const isAdmin = organization.role === "admin";
  const [teams, setTeams] = useState<Team[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    if (!organization.id) {
      return;
    }
    async function getAll() {
      const result = await getTeams(organization.id);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      setTeams(result.teams);
    }

    getAll();
  }, [fetchAgain, addToast, organization]);

  return (
    <>
      <title>Teams | Create & Manage</title>
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">
              Organizations Teams
            </h1>
            <p className="text-sm text-gray-500">
              {isAdmin
                ? "Manage & view all teams in this organization."
                : "Teams in this organization."}
            </p>
          </div>

          {isAdmin && slug && (
            <CreateTeamModal
              organizationId={organization.id}
              setFetchAgain={setFetchAgain}
            />
          )}
        </div>
      </section>
      {slug && (
        <OragnizationTeams
          organizationId={organization.id}
          setFetchAgain={setFetchAgain}
          teams={teams}
        />
      )}
    </>
  );
};
export default OrganizationTeamsPage;
