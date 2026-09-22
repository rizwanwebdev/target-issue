import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getSingleTeam, { type Team } from "../api/team/getSingleTeam.api.ts";
import { useToast } from "../context/ToastProvider.tsx";

const OrgTeam = () => {
  const { slug, team } = useParams<{ slug: string; team: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Team | null>(null);

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !team) {
        return;
      }
      const res = await getSingleTeam(Number(team), slug);
      console.log(res);
      if (res.error) {
        addToast(res.message, "error");
      }
      setResult(res.team);
    };
    getResults();
  }, [slug, team]);

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

export default OrgTeam;
