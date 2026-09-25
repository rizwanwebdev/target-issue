import { useOutletContext, useParams } from "react-router-dom";
import type { Organization } from "@/api/org/getOrg.api";
import CreateTeamForm from "@/components/dashboard/utils/CreateTeamForm.tsx";
import OragnizationTeams from "@/components/dashboard/utils/OragnizationTeams.tsx";

type OrganizationContext = {
  organization: Organization;
};

const OrganizationTeamsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { organization } = useOutletContext<OrganizationContext>();

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

          <button type="button" className="btn btn-primary w-fit">
            + Create Team
          </button>
        </div>
      </section>
      {isAdmin && slug && <CreateTeamForm slug={slug} />}
      {slug && <OragnizationTeams slug={slug} />}
    </>
  );
};
export default OrganizationTeamsPage;
