import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "@/context/ToastProvider.tsx";

import getAllMembersApi from "@/api/org/getAllMembers.api.ts";
import type { Members } from "@/types/Member";

type Props = {
  slug: string;
  organizationId: number;
  fetchAgain?: boolean;
  projectId?: number;
};

const OrganizationMembers = ({
  slug,
  organizationId,
  fetchAgain,
  projectId,
}: Props) => {
  const [members, setMembers] = useState<Members[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);

  const { addToast } = useToast();

  useEffect(() => {
    async function getAll() {
      const result = await getAllMembersApi(
        organizationId,
        page,
        limit,
        projectId,
      );
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setMembers(result.members);
    }

    getAll();
  }, [organizationId, slug, page, limit, fetchAgain]);

  return (
    <section className="my-4">
      <div className="flex w-full flex-col gap-3">
        {members.map((member) => (
          <div
            key={member.user_id}
            className="group flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
          >
            {/* Organization info */}
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

              {/* Name + description */}
              <div className="min-w-0">
                <Link
                  to={`/dashboard/organizations/${slug}/members/${member.user_id}`}
                  className="block truncate text-base font-semibold text-text transition-colors hover:text-hover"
                >
                  {member.full_name}
                </Link>

                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {"No description provided."}
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
        ))}
      </div>
    </section>
  );
};

export default OrganizationMembers;
