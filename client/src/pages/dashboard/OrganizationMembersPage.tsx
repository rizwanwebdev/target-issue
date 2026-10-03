import OrganizationMembers from "@/components/dashboard/utils/OrganizationMembers.tsx";

import { useOutletContext, useParams } from "react-router-dom";
import InviteMembersModal from "@/components/modals/InviteMembersModal";
import { useState } from "react";

import type { OrganizationOutletContext } from "@/types/OrganizationOutletContext";

const OrganizationMemebersPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);

  const { organization } = useOutletContext<OrganizationOutletContext>();

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

          {isAdmin && slug && (
            <InviteMembersModal
              organizationId={organization.id}
              setFetchAgain={setFetchAgain}
            />
          )}
        </div>
      </section>
      {slug && (
        <OrganizationMembers
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
          slug={slug}
          organizationId={organization.id}
        />
      )}
    </>
  );
};
export default OrganizationMemebersPage;
