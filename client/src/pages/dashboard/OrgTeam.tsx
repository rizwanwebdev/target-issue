import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getSingleTeam, { type Team } from "@/api/team/getSingleTeam.api.ts";
import { useToast } from "@/context/ToastProvider.tsx";

const OrgTeam = () => {
  const { slug, teamId } = useParams<{ slug: string; teamId: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Team | null>(null);

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !teamId) {
        return;
      }
      const res = await getSingleTeam(Number(teamId), slug);
      if (res.error) {
        addToast(res.message, "error");
      }
      setResult(res.team);
    };
    getResults();
  }, [slug, teamId]);

  return (
    <>
      <main className="bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 border w-full">
            <p>{result?.name}</p>
            <p>{result?.description}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrgTeam;
