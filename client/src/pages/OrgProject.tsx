import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../context/ToastProvider.tsx";
import getSingleproject, {
  type Project,
} from "../api/project/getSingleproject.api.ts";

const OrgProject = () => {
  const { slug, project } = useParams<{ slug: string; project: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Project | null>(null);

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !project) {
        return;
      }
      const res = await getSingleproject(Number(project), slug);
      if (res.error) {
        addToast(res.message, "error");
      }
      setResult(res.project);
    };
    getResults();
  }, [slug, project]);

  return (
    <>
      <main className="bg-gray-50 p-4 md:px-8">
        <div className="min-h-screen flex flex-col items-center gap-4">
          <div className="p-4 border w-full">
            <p>{result?.name}</p>
            <p>{result?.description}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrgProject;
