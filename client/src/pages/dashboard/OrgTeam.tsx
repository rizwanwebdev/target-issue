import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import getSingleTeam from "@/api/team/getSingleTeam.api.ts";
import { useToast } from "@/context/ToastProvider.tsx";
import type { OrganizationOutletContext } from "@/types/OrganizationOutletContext";
import type { Team } from "@/types/Team";

const OrgTeam = () => {
  const navigate = useNavigate();
  const { slug, teamId } = useParams<{ slug: string; teamId: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Team | null>(null);
  const { organization } = useOutletContext<OrganizationOutletContext>();
  useEffect(() => {
    const getResults = async () => {
      if (!slug || !teamId) {
        return;
      }
      const res = await getSingleTeam(teamId, organization.id);
      if (res.error) {
        navigate(`/dashboard/organizations/${slug}/teams`);
        addToast(res.message, "error");
        return;
      }
      setResult(res.team);
    };
    getResults();
  }, [slug, teamId]);
  useEffect(() => {
    document.title = result?.name ? `${result.name} | Team` : "Team | About";
  }, [result?.name]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Team color banner */}
          <div
            className="h-24"
            style={{
              backgroundColor: result?.color || "#0a2463",
            }}
          />

          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                {/* Team icon */}
                <div
                  className="flex size-16 shrink-0 -mt-12 items-center justify-center rounded-2xl border-4 border-white text-2xl font-bold text-white shadow-sm"
                  style={{
                    backgroundColor: result?.color || "#0a2463",
                  }}
                >
                  {result?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 pt-1">
                  <h1 className="text-2xl font-bold text-text">
                    {result?.name}
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    {result?.description || "No description provided."}
                  </p>
                </div>
              </div>

              {result?.role && (
                <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                  {result.role}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Team information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* About */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-text">About Team</h2>
            <p className="mt-1 text-sm text-gray-500">
              Information about this team.
            </p>
          </div>

          <div className="p-6">
            <p className="text-sm leading-6 text-gray-600">
              {result?.description || "No description provided."}
            </p>
          </div>
        </section>

        {/* Team details */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-text">Team Details</h2>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Your Role
              </p>

              <p className="mt-2 font-medium capitalize text-text">
                {result?.role || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Members
              </p>

              <p className="mt-2 font-medium text-text">
                {result?.member_count || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Team ID
              </p>

              <p className="mt-2 font-mono text-sm text-gray-600">
                @{result?.slug || "—"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrgTeam;
