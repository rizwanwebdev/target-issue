import OrganizationProjects from "@/components/dashboard/utils/OrganizationProjects.tsx";

import { useOutletContext, useParams } from "react-router-dom";
import type { Organization } from "@/api/org/getOrg.api";
import CreateProjectForm from "@/components/dashboard/utils/CreateProjectForm.tsx";

type OrganizationContext = {
  organization: Organization;
};

const OrganizationProjectsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { organization } = useOutletContext<OrganizationContext>();

  const isAdmin = organization.role === "admin";

  return (
    <>
      <title>Projects | Create & Manage</title>
      {isAdmin && slug && <CreateProjectForm slug={slug} />}
      {slug && <OrganizationProjects slug={slug} />}
      {/* projects */}
    </>
  );
};
export default OrganizationProjectsPage;
