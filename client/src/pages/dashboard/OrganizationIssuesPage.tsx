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
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">
              Organizations Issues
            </h1>
            <p className="text-sm text-gray-500">
              Manage all the issues in this organization.
            </p>
          </div>

          <button type="button" className="btn btn-primary w-fit">
            + Create Issue
          </button>
        </div>
      </section>
      <div className="flex flex-col gap-4 ">
        {slug && <OrganizationMembers slug={slug} />}
      </div>
    </>
  );
};
export default OrganizationIssuesPage;
