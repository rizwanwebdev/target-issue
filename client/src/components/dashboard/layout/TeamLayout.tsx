import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useToast } from "@/hooks/useToast";

import type { ProjectOutletContext } from "@/types/OutletContexts";
import apiRequest from "@/api/apiRequest";
import type { Team } from "@/types/Team";

const TeamLayout = () => {
  const [loading, setLoading] = useState(true);
  const { slug, teamSlug } = useParams<{
    slug: string;
    teamSlug: string;
  }>();
  const { addToast } = useToast();
  const [team, setTeam] = useState<Team | null>(null);
  const { organization, project } = useOutletContext<ProjectOutletContext>();

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !teamSlug) {
        return;
      }
      setLoading(true);

      const result = await apiRequest({
        method: "POST",
        endpoint: "/team/team",
        body: {
          organizationId: organization.id,
          projectId: project.id,
          teamSlug: teamSlug,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
      }
      setTeam(result.team);
      setLoading(false);
    };
    getResults();
  }, [slug, project, addToast, organization, teamSlug]);

  if (!team) {
    return null;
  }
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }
  return <Outlet context={{ organization, project, team }} />;
};

export default TeamLayout;
