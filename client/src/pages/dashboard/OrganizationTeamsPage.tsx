import { useOutletContext, useParams } from "react-router-dom";
import { useState } from "react";
import CreateTeamModal from "@/components/modals/CreateTeamModal";

import type { OrganizationOutletContext } from "@/types/OrganizationOutletContext";
import DisplayTeams from "@/components/dashboard/utils/DisplayTeams";

const OrganizationTeamsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { organization } = useOutletContext<OrganizationOutletContext>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const isAdmin = organization.role === "admin";

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
        <DisplayTeams
          organizationId={organization.id}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />
      )}
    </>
  );
};
export default OrganizationTeamsPage;
