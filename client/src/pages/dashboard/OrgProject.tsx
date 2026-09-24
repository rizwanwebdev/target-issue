import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useToast } from "@/context/ToastProvider.tsx";
import getSingleproject, {
  type Project,
} from "@/api/project/getSingleproject.api.ts";
import CreateIssuesForm from "@/components/dashboard/utils/CreateIssuesForm";
import type { Organization } from "@/api/org/getAllOrganizations";

type OrganizationContext = {
  organization: Organization;
};

const OrgProject = () => {
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Project | null>(null);
  const { organization } = useOutletContext<OrganizationContext>();

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !projectId) {
        return;
      }
      const res = await getSingleproject(Number(projectId), slug);
      if (res.error) {
        addToast(res.message, "error");
      }
      setResult(res.project);
    };
    getResults();
  }, [slug, projectId]);

  return (
    <>
      <title>Project | About</title>
      <div className="flex flex-col gap-4">
        <section>
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 border w-full">
              <p>{result?.name}</p>
              <p>{result?.description}</p>
            </div>
          </div>
        </section>
        {slug && (
          <CreateIssuesForm
            organizationId={organization.id}
            projectId={Number(projectId)}
          />
        )}
      </div>
    </>
  );
};

export default OrgProject;
