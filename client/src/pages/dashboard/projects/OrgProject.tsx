import { useOutletContext } from "react-router-dom";
import CreateIssueModal from "@/components/modals/CreateIssueModal";

import type { ProjectOutletContext } from "@/types/ProjectOutletContext";
import DisplayRecentActivities from "@/components/dashboard/utils/DisplayRecentActivities";
const OrgProject = () => {
  const { organization, project } = useOutletContext<ProjectOutletContext>();
  const isAdmin = project.role === "admin";
  return (
    <>
      <title>Project | About</title>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-text">
                Project Overview
              </h1>
              <p className="text-sm text-gray-500">
                {isAdmin
                  ? "Manage the Project you belong to"
                  : "View the Project you belong to"}
              </p>
            </div>

            {project && (
              <CreateIssueModal
                projectId={project.id}
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
                {project?.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + Description */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="truncate text-2xl font-semibold text-text">
                    {project?.name}
                  </h1>

                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                    {project?.status.toUpperCase()}
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
        {/* Project Details */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text">Project Details</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Project name</p>
              <p className="mt-1 font-medium text-text">{project?.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Project Status</p>
              <p className="mt-1 font-medium capitalize text-text">
                {project?.status.toUpperCase()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="mt-1 font-medium text-text">
                {project?.start_date &&
                  new Date(project?.start_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Target Date</p>
              <p className="mt-1 font-medium text-text">
                {project?.start_date &&
                  new Date(project?.target_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">My Role</p>
              <p className="mt-1 font-medium capitalize text-text">
                {project?.role.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="mt-1 font-medium text-text">
                {project?.start_date &&
                  new Date(project?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>
        <DisplayRecentActivities
          organizationId={organization.id}
          projectId={project.id}
        />
      </main>
    </>
  );
};

export default OrgProject;
