import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "@/context/ToastProvider.tsx";

import type { Member } from "@/types/Member";
import ActionMenu from "@/components/utils/ActionMenu";
import apiRequest from "@/api/apiRequest";

type Props = {
  slug: string;
  organizationId: number;
  fetchAgain?: boolean;
  projectId?: number;
  projectSlug?: string;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrganizationMembers = ({
  slug,
  organizationId,
  fetchAgain,
  projectId,
  projectSlug,
  setFetchAgain,
}: Props) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);
  const { addToast } = useToast();
  useEffect(() => {
    async function getAll() {
      const result = await apiRequest({
        method: "POST",
        endpoint: "/org/all-members",
        body: {
          organizationId: organizationId,
          page: page,
          limit: limit,
          projectId: projectId,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setMembers(result.members);
    }

    getAll();
  }, [organizationId, slug, page, limit, fetchAgain, addToast, projectId]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const handleDelete = async (deleteId: number) => {
    try {
      const endpoint = projectId
        ? "/project/remove-member"
        : "/org/remove-member";
      const result = await apiRequest({
        method: "DELETE",
        endpoint: endpoint,
        body: {
          organizationId: organizationId,
          projectId: projectId,
          memberId: deleteId,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      setFetchAgain((prev) => !prev);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to load comments",
        "error",
      );
    }
  };
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
              onDelete={() => handleDelete(member.user_id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrganizationMembers;
