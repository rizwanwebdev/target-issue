import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/context/ToastProvider.tsx";
import getSingleproject, {
  type Project,
} from "@/api/project/getSingleproject.api.ts";
import CreateIssuesForm from "@/components/dashboard/utils/CreateIssuesForm";

const OrgProject = () => {
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Project | null>(null);

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
      <div className="flex flex-col gap-4">
        <section className="bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 border w-full">
              <p>{result?.name}</p>
              <p>{result?.description}</p>
            </div>
          </div>
        </section>
        {slug && <CreateIssuesForm slug={slug} />}
      </div>
    </>
  );
};

export default OrgProject;
