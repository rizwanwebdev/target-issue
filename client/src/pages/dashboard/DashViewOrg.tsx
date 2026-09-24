import { useOutletContext } from "react-router-dom";
import type { Organization } from "@/api/org/getAllOrganizations.ts";
import { useEffect } from "react";

type OrganizationContext = {
  organization: Organization;
};

const DashViewOrg = () => {
  const { organization } = useOutletContext<OrganizationContext>();

  useEffect(() => {
    document.title = organization
      ? `${organization.name} | TargetIssue`
      : "Organization | TargetIssue";
  }, [organization]);

  if (!organization) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        {/* Organization Header */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {/* Logo */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-2xl font-bold text-primary">
                {organization.logo_url ? (
                  <img
                    src={organization.logo_url}
                    alt={`${organization.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  organization.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Name + Description */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="truncate text-2xl font-semibold text-text">
                    {organization.name}
                  </h1>

                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold capitalize text-accent">
                    {organization.role}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {organization.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Organization slug */}
            <div className="shrink-0">
              <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600">
                @{organization.slug}
              </span>
            </div>
          </div>
        </section>

        {/* Overview Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Projects</p>
            <p className="mt-2 text-2xl font-semibold text-text">0</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Teams</p>
            <p className="mt-2 text-2xl font-semibold text-text">0</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Members</p>
            <p className="mt-2 text-2xl font-semibold text-text">0</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Open Issues</p>
            <p className="mt-2 text-2xl font-semibold text-text">0</p>
          </div>
        </section>

        {/* Organization Details */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text">
            Organization Details
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Organization name</p>
              <p className="mt-1 font-medium text-text">{organization.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Slug</p>
              <p className="mt-1 font-medium text-text">{organization.slug}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Your role</p>
              <p className="mt-1 font-medium capitalize text-text">
                {organization.role}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="mt-1 font-medium text-text">
                {new Date(organization.joined_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">Recent Activity</h2>
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-500">
              No recent activity to display.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashViewOrg;
