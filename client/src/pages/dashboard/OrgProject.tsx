import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useToast } from "@/context/ToastProvider.tsx";
import getSingleproject, {
  type Project,
} from "@/api/project/getSingleproject.api.ts";
import type { Organization } from "@/api/org/getAllOrganizations";
import CreateIssueModal from "@/components/modals/CreateIssueModal";

type OrganizationContext = {
  organization: Organization;
};

const OrgProject = () => {
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Project | null>(null);
  const { organization } = useOutletContext<OrganizationContext>();
  useEffect(() => {
    const getResults = async () => {
      if (!slug || !projectId) {
        return;
      }
      const res = await getSingleproject(Number(projectId), slug);
      if (res.error) {
        addToast(res.message, "error");
      }
      setResult(res.project);
    };
    getResults();
  }, [slug, projectId]);
  const isAdmin = organization.role === "admin";
  return (
    <>
      <title>Project | About</title>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-text">
                Organizations Project
              </h1>
              <p className="text-sm text-gray-500">
                {isAdmin
                  ? "Manage the Project you belong to"
                  : "View the Project you belong to"}
              </p>
            </div>

            {projectId && (
              <CreateIssueModal
                projectId={Number(projectId)}
                organizationId={organization.id}
              />
            )}
          </div>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {/* Logo */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-2xl font-bold text-primary">
                {result?.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + Description */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="truncate text-2xl font-semibold text-text">
                    {result?.name}
                  </h1>

                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                    {result?.status.toUpperCase()}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {organization.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text">Project Details</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Project name</p>
              <p className="mt-1 font-medium text-text">{result?.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Project Status</p>
              <p className="mt-1 font-medium capitalize text-text">
                {result?.status.toUpperCase()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="mt-1 font-medium text-text">
                {result?.start_date &&
                  new Date(result?.start_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Target Date</p>
              <p className="mt-1 font-medium text-text">
                {result?.start_date &&
                  new Date(result?.target_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

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
      </main>
    </>
  );
};

export default OrgProject;
