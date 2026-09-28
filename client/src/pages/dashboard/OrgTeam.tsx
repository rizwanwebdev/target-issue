import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import getSingleTeam from "@/api/team/getSingleTeam.api.ts";
import { useToast } from "@/context/ToastProvider.tsx";
import type { OrganizationOutletContext } from "@/types/OrganizationOutletContext";
import type { Team } from "@/types/Team";
const OrgTeam = () => {
  const { slug, teamId } = useParams<{ slug: string; teamId: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Team | null>(null);
  const { organization } = useOutletContext<OrganizationOutletContext>();
  useEffect(() => {
    const getResults = async () => {
      if (!slug || !teamId) {
        return;
      }
      const res = await getSingleTeam(Number(teamId), organization.id);
      if (res.error) {
        addToast(res.message, "error");
      }
      setResult(res.team);
    };
    getResults();
  }, [slug, teamId]);

  return (
    <>
      <title>Team | About</title>
      <main>
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
