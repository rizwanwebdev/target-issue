import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Team } from "@/types/Team";

import ActionMenu from "@/components/utils/ActionMenu";
import apiRequest from "@/api/apiRequest";
import { useToast } from "@/hooks/useToast";
type Props = {
  organizationId: number;
  projectId?: number;
  projectSlug?: string;
  fetchAgain: boolean;
};
const DisplayTeams = ({
  organizationId,
  projectId,
  fetchAgain,
  projectSlug,
}: Props) => {
  const { slug } = useParams<{ slug: string; projectId: string }>();
  const { addToast } = useToast();
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (!organizationId) {
      return;
    }

    async function getAll() {
      const result = await apiRequest({
        method: "POST",
        endpoint: "/team/get-teams",
        body: {
          projectId: projectId,
          organizationId: organizationId,
        },
      });

      if (result.error) {
        setTeams([]);
        return;
      }

      setTeams(result.teams);
    }

    getAll();
  }, [organizationId, projectId, fetchAgain]);
  const handleDelete = async (deleteId: number) => {
    if (!deleteId) return;
    try {
      const endpoint = projectId ? "/project/remove-team" : "/team/delete";
      const apiBody = projectId
        ? {
            organizationId: organizationId,
            projectId: projectId,
            teamId: deleteId,
          }
        : {
            organizationId: organizationId,
            teamId: deleteId,
          };
      if (!organizationId) return;
      const result = await apiRequest({
        method: "DELETE",
        endpoint: endpoint,
        body: apiBody,
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      setTeams((prev) => prev.filter((team) => team.team_id !== deleteId));
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to load comments",
        "error",
      );
    }
  };
  const handleLeave = async (deleteId: number) => {
    try {
      if (!organizationId || !deleteId) return;
      const result = await apiRequest({
        method: "DELETE",
        endpoint: "/team/leave",
        body: {
          organizationId: organizationId,
          teamId: deleteId,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      setTeams((prev) => prev.filter((team) => team.team_id !== deleteId));
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to load comments",
        "error",
      );
    }
  };

  return teams.length === 0 ? (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <p className="font-medium text-text">Teams Not Found</p>

      <p className="mt-1 text-sm text-gray-500">
        First create OR joing a team in{" "}
        <Link
          className="text-indigo-500 underline"
          to={`/dashboard/organizations/${slug}/teams`}
        >
          Organization
        </Link>{" "}
        Then Assign in Projects
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
            <div className="flex gap-2  justify-between items-center w-full flex-1">
              {/* Teams info */}
              <div className="flex min-w-0 items-center gap-4">
                {/* Logo */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                  {team.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + description */}
                <div className="min-w-0">
                  <Link
                    to={`/dashboard/organizations/${slug}/${projectSlug ? `projects/${projectSlug}/teams/${team.slug}` : `teams/${team.slug}`}`}
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
              {team.role && (
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    team.role === "admin"
                      ? "bg-accent/10 text-accent"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {team.role}
                </span>
              )}
            </div>
            <ActionMenu
              isOpen={activeMenuId === team.team_id}
              onToggle={() =>
                setActiveMenuId((prev) =>
                  prev === team.team_id ? null : team.team_id,
                )
              }
              role={team.role}
              actions={[
                {
                  label: "Leave",
                  roles: ["member", "admin"],
                  visible: !!team.role,
                  variant: "danger",
                  onClick: () => handleLeave(team.team_id),
                  confirm: {
                    title: "Leave Team",
                    message: "Are you sure you want to leave?",
                    confirmText: "Yes, Leave",
                  },
                },
                {
                  label: "Remove",
                  roles: ["admin"],
                  visible: team.role === "admin",
                  variant: "danger",
                  onClick: () => handleDelete(team.team_id),
                  confirm: {
                    title: "Remove Member",
                    message:
                      "Are you sure you want to remove this team? This action cannot be undone.",
                    confirmText: "Yes, Remove",
                  },
                },
              ]}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DisplayTeams;
