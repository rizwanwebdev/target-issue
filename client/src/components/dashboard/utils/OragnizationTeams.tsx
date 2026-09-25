import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "@/context/ToastProvider.tsx";
import getTeams, { type Team } from "@/api/team/getTeams.api.ts";
type Props = {
  organizaionId: number;
  slug: string;
  fetchAgain: boolean;
};

const OragnizationTeams = ({ organizaionId, slug, fetchAgain }: Props) => {
  const [teams, setTeams] = useState<Team[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    async function getAll() {
      const result = await getTeams(organizaionId);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setTeams(result.teams);
    }

    getAll();
  }, [organizaionId, slug, fetchAgain]);

  return (
    teams.length > 0 && (
      <section className="w-full my-4">
        <div className="flex w-full flex-col gap-3">
          {teams.map((team) => (
            <div
              key={team.team_id}
              className="group flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            >
              {/* Organization info */}
              <div className="flex min-w-0 items-center gap-4">
                {/* Logo */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                  {team.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + description */}
                <div className="min-w-0">
                  <Link
                    to={`/dashboard/organizations/${slug}/teams/${team.id}`}
                    className="block truncate text-base font-semibold text-text transition-colors hover:text-hover"
                  >
                    {team.name}
                  </Link>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {team.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Role */}
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  team.role === "admin"
                    ? "bg-accent/10 text-accent"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {team.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    )
  );
};

export default OragnizationTeams;
