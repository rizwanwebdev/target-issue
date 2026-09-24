import OrganizationMembers from "@/components/dashboard/utils/OrganizationMembers.tsx";

import { useOutletContext, useParams } from "react-router-dom";
import type { Organization } from "@/api/org/getOrg.api";
import InviteMemebersForm from "@/components/dashboard/utils/InviteMemebersForm.tsx";

type OrganizationContext = {
  organization: Organization;
};

const OrganizationMemebersPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { organization } = useOutletContext<OrganizationContext>();

  const isAdmin = organization.role === "admin";

  return (
    <>
      <title>Members | Create & Manage</title>
      <meta name="description" content="Create and Manage Members" />
      {isAdmin && slug && <InviteMemebersForm slug={slug} />}
      {slug && <OrganizationMembers slug={slug} />}
      {/* projects */}
    </>
  );
};
export default OrganizationMemebersPage;
