import { useOutletContext } from "react-router-dom";
import type { Organization } from "@/api/org/getAllOrganizations.ts";
import { useEffect } from "react";

type OrganizationContext = {
  organization: Organization;
};
const DashViewOrg = () => {
  const { organization } = useOutletContext<OrganizationContext>();
  useEffect(() => {
    document.title = organization
      ? `${organization.name} | Create & Manage`
      : "Organization | Create & Manage";
  }, [organization]);

  return (
    <>
      <meta name="description" content="Create and Manage Organizations" />

      <main className="bg-gray-50">
        <div className="min-h-screen flex flex-col items-center gap-4">
          <div className="p-4 border w-full">
            <p>{organization?.name}</p>
            <p>{organization?.description}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashViewOrg;
