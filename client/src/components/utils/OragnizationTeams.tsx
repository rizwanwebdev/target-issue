import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "../../context/ToastProvider.tsx";
import type { Organization } from "../../api/org/getOrg.api.ts";
import getTeams, { type Team } from "../../api/team/getTeams.api.ts";
type Props = {
  slug: string;
  organization?: Organization;
};

const OragnizationTeams = ({ slug, organization }: Props) => {
  const [teams, setTeams] = useState<Team[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    async function getAll() {
      const result = await getTeams(slug);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setTeams(result.teams);
    }

    getAll();
  }, [slug, addToast, organization]);

  return (
    teams.length > 0 && (
      <div className="w-full py-4">
        <div>
          <h2 className="text-4xl font-semibold text-center my-2">
            Organization Teams
          </h2>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="w-full flex flex-col flex-wrap justify-between border border-gray-400 p-2 rounded-lg"
            >
              <div className="flex flex-row flex-wrap justify-between">
                <Link
                  className="text-indigo-600"
                  to={`/dashboard/organizations/${slug}/teams/${team.id}`}
                >
                  {team.name}
                </Link>
                <span className="text-green-600">{team.role}</span>
              </div>
              <div>
                <span>{team.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default OragnizationTeams;
