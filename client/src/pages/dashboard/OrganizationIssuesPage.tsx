import { useOutletContext, useParams } from "react-router-dom";

import type { OrganizationOutletContext } from "@/types/OutletContexts";
import DisplayIssues from "@/components/dashboard/utils/DisplayIssues";

const OrganizationIssuesPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { organization } = useOutletContext<OrganizationOutletContext>();

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
        </div>
      </section>
      <div className="flex flex-col gap-4 ">
        {slug && <DisplayIssues slug={slug} organizationId={organization.id} />}
      </div>
    </>
  );
};
export default OrganizationIssuesPage;
