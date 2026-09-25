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
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">
              Organizations Members
            </h1>
            <p className="text-sm text-gray-500">
              {isAdmin
                ? "Manage & view all members in this organization."
                : "Members in this organization."}
            </p>
          </div>

          <button type="button" className="btn btn-primary w-fit">
            + Invite Members
          </button>
        </div>
      </section>
      {isAdmin && slug && <InviteMemebersForm slug={slug} />}
      {slug && <OrganizationMembers slug={slug} />}
      {/* projects */}
    </>
  );
};
export default OrganizationMemebersPage;
