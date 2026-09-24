import OrganizationMembers from "@/components/dashboard/utils/OrganizationMembers.tsx";

import { useOutletContext, useParams } from "react-router-dom";
import type { Organization } from "@/api/org/getOrg.api";

type OrganizationContext = {
  organization: Organization;
};

const OrganizationIssuesPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { organization } = useOutletContext<OrganizationContext>();

  return (
    <>
      <title>Issues | Create & Manage</title>
      <div className="flex flex-col gap-4 ">
        <p>{organization.name}</p>
        {slug && <OrganizationMembers slug={slug} />}
      </div>
    </>
  );
};
export default OrganizationIssuesPage;
