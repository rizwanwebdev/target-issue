import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useToast } from "@/hooks/useToast";

import type { Member } from "@/types/Member";
import ActionMenu from "@/components/utils/ActionMenu";
import apiRequest from "@/api/apiRequest";
import useAuth from "@/hooks/useAuth";

type Props = {
  organizationId: number;
  fetchUrl: string;
  leaveUrl: string;
  removeUrl: string;
  fetchAgain?: boolean;
  projectId?: number;
  teamId?: number;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const DisplayMembers = ({
  organizationId,
  fetchUrl,
  leaveUrl,
  removeUrl,
  fetchAgain,
  teamId,
  projectId,
}: Props) => {
  const { slug, projectSlug } = useParams<{
    slug: string;
    projectSlug: string;
  }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    async function getAll() {
      const result = await apiRequest({
        method: "GET",
        endpoint: fetchUrl,
        body: {
          organizationId: organizationId,
          teamId: teamId,
          projectId: projectId,
          page: page,
          limit: limit,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setMembers(result.members);
    }

    getAll();
  }, [
    organizationId,
    slug,
    page,
    limit,
    fetchAgain,
    addToast,
    projectId,
    fetchUrl,
    teamId,
  ]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const handleRemove = async (deleteId: number) => {
    try {
      const result = await apiRequest({
        method: "DELETE",
        endpoint: removeUrl,
        body: {
          organizationId: organizationId,
          projectId: projectId,
          memberId: deleteId,
          teamId: teamId,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      setMembers((prev) =>
        prev.filter((member) => member.user_id !== deleteId),
      );
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to load comments",
        "error",
      );
    }
  };
  const handleLeave = async (deleteId: number) => {
    try {
      if (!deleteId) return;
      const result = await apiRequest({
        method: "DELETE",
        endpoint: leaveUrl,
        body: {
          organizationId: organizationId ? organizationId : deleteId,
          projectId: projectId ? projectId : deleteId,
          teamId: teamId ? teamId : deleteId,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      if (teamId) {
        navigate("/dashboard/organizations");
        return;
      } else if (projectId) {
        navigate(`/dashboard/organizations/${slug}/projects`);
        return;
      } else if (organizationId) {
        navigate("/dashboard/organizations");
        return;
      } else {
        navigate("/dashboard");
        return;
      }
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to load comments",
        "error",
      );
    }
  };

  const currentMember = members.find((member) => member.user_id === user?.id);
  const currentUserRole = currentMember?.role;
  return members.length === 0 ? (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <p className="font-medium text-text">Members Not Found</p>

      <p className="mt-1 text-sm text-gray-500">
        There are no members to display.
      </p>
    </div>
  ) : (
    <section className="my-4">
      <div className="flex w-full flex-col gap-3">
        {members.map((member) => (
          <div
            key={member.user_id}
            className="group flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex gap-2 items-center justify-between flex-1 w-full">
              {/* Member info */}
              <div className="flex min-w-0 items-center gap-4">
                {/* Logo */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={`${member.full_name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    member.full_name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <Link
                    to={`/dashboard/organizations/${slug}/${projectSlug ? `projects/${projectSlug}/members/${member.username}` : `members/${member.username}`}`}
                    className="block truncate text-base font-semibold text-text transition-colors hover:text-hover"
                  >
                    {member.full_name}
                  </Link>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    Joined At: {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Role */}
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  member.role === "admin"
                    ? "bg-accent/10 text-accent"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {member.role}
              </span>
            </div>

            <ActionMenu
              isOpen={activeMenuId === member.user_id}
              onToggle={() =>
                setActiveMenuId((prev) =>
                  prev === member.user_id ? null : member.user_id,
                )
              }
              role={currentUserRole}
              actions={[
                {
                  label: "Leave",
                  roles: ["member", "admin"],
                  visible: member.user_id === user?.id,
                  variant: "danger",
                  onClick: () => handleLeave(member.user_id),
                  confirm: {
                    title: "Leave Team",
                    message: "Are you sure you want to leave?",
                    confirmText: "Yes, Leave",
                  },
                },
                {
                  label: "Remove",
                  roles: ["admin"],
                  visible: member.user_id !== user?.id,
                  variant: "danger",
                  onClick: () => handleRemove(member.user_id),
                  confirm: {
                    title: "Remove Member",
                    message:
                      "Are you sure you want to remove this member? This action cannot be undone.",
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

export default DisplayMembers;
