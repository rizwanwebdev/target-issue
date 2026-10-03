import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import type { Member } from "@/types/Member";
import { useToast } from "@/hooks/useToast";
import type { OrganizationOutletContext } from "@/types/OutletContexts";
import apiRequest from "@/api/apiRequest";

const OrgMember = () => {
  const { slug, username, projectSlug } = useParams<{
    slug: string;
    projectSlug: string;
    username: string;
  }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [result, setResult] = useState<Member | null>(null);
  const { organization } = useOutletContext<OrganizationOutletContext>();

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !username) {
        return;
      }
      const result = await apiRequest({
        method: "POST",
        endpoint: "/org/member",
        body: {
          organizationId: organization.id,
          username: username,
        },
      });
      if (result.error) {
        if (projectSlug) {
          navigate(
            `/dashboard/organizations/${slug}/projects/${projectSlug}/members`,
          );
        } else {
          navigate(`/dashboard/organizations/${slug}/members`);
        }

        addToast(result.message, "error");

        // return;
      }
      setResult(result.member);
    };
    getResults();
  }, [slug, username]);
  useEffect(() => {
    if (!result) return;

    document.title = projectSlug
      ? `${result.full_name} | Project Member`
      : `${result.full_name} | ${organization.name}`;
  }, [result, organization.name, projectSlug]);
  return (
    <main className="mx-auto w-full max-w-6xl py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="shrink-0">
            {result?.avatar_url ? (
              <img
                src={result.avatar_url}
                alt={result.full_name}
                className="size-20 rounded-full object-cover ring-4 ring-gray-100"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-white ring-4 ring-gray-100">
                {result?.full_name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Identity */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-text">
                {result?.full_name}
              </h1>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                {result?.role}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">@{result?.username}</p>

            <p className="mt-3 text-sm text-gray-500">
              {projectSlug
                ? "Member of this project"
                : "Member of this organization"}
            </p>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Member information */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-text">Member Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Basic information about this member.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Full Name
              </p>

              <p className="mt-2 font-medium text-text">
                {result?.full_name || "—"}
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Username
              </p>

              <p className="mt-2 font-medium text-text">
                @{result?.username || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Membership */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-text">Membership</h2>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Role
              </p>

              <p className="mt-2 font-medium capitalize text-text">
                {result?.role || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Joined
              </p>

              <p className="mt-2 font-medium text-text">
                {result?.joined_at
                  ? new Date(result.joined_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrgMember;
