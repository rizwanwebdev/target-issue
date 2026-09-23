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
    <main>
      <h1>{organization.name}</h1>

      {isAdmin && slug && <InviteMemebersForm slug={slug} />}
      {slug && <OrganizationMembers slug={slug} />}
      {/* projects */}
    </main>
  );
};
export default OrganizationMemebersPage;
