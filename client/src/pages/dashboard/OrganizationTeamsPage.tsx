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
      <meta name="description" content="Create and Manage Teams" />
      {isAdmin && slug && <CreateTeamForm slug={slug} />}
      {slug && <OragnizationTeams slug={slug} />}
    </>
  );
};
export default OrganizationTeamsPage;
