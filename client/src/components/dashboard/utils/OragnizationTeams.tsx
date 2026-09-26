import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "@/context/ToastProvider.tsx";
import getTeams from "@/api/team/getTeams.api.ts";
import type { Team } from "@/types/Team";
type Props = {
  organizaionId: number;
  projectId?: number;
  slug: string;
  fetchAgain: boolean;
};

const OragnizationTeams = ({
  organizaionId,
  slug,
  fetchAgain,
  projectId,
}: Props) => {
  const [teams, setTeams] = useState<Team[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    async function getAll() {
      const result = await getTeams(organizaionId, projectId);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setTeams(result.teams);
    }

    getAll();
  }, [organizaionId, slug, fetchAgain, projectId]);

  return teams.length === 0 ? (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <p className="font-medium text-text">Teams Not Found</p>

      <p className="mt-1 text-sm text-gray-500">
        There are no teams to display.
      </p>
    </div>
  ) : (
    <section className="w-full my-4">
      <div className="flex w-full flex-col gap-3">
        {teams.map((team) => (
          <div
            key={team.team_id}
            className="group flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
          >
            {/* Teams info */}
            <div className="flex min-w-0 items-center gap-4">
              {/* Logo */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                {team.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + description */}
              <div className="min-w-0">
                <Link
                  to={`/dashboard/organizations/${slug}/teams/${team.team_id}`}
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
  );
};

export default OragnizationTeams;
