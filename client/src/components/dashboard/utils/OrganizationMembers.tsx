import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "@/context/ToastProvider.tsx";

import getAllMembersApi, { type Members } from "@/api/org/getAllMembers.api.ts";

import type { Organization } from "@/api/org/getOrg.api.ts";

type Props = {
  slug: string;
  organization?: Organization;
};

const OrganizationMembers = ({ slug, organization }: Props) => {
  const [members, setMembers] = useState<Members[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);

  const { addToast } = useToast();

  useEffect(() => {
    async function getAll() {
      const result = await getAllMembersApi(slug, page, limit);

      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setMembers(result.members);
    }

    getAll();
  }, [organization, slug, page, limit]);

  return (
    <section className="w-full py-4">
      <div>
        <h2 className="text-4xl font-semibold text-center my-2">
          Organization Members
        </h2>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        {members.map((member) => (
          <div
            key={member.user_id}
            className="w-full flex flex-col flex-wrap justify-between border border-gray-400 p-2 rounded-lg"
          >
            <div className="flex flex-row flex-wrap justify-between">
              <Link
                className="text-indigo-600"
                to={`/dashboard/organizations/${slug}/members/${member.user_id}`}
              >
                {member.full_name}
              </Link>

              <span
                className="text-green-600"
                aria-label="Member role in this oraganization"
              >
                {member.role}
              </span>

              <span className="text-green-600" aria-label="Joinged At Date">
                {member.joined_at.split("T")[0]}
              </span>
            </div>

            <span>{member.email}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrganizationMembers;
