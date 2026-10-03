import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "@/hooks/useToast";
import type { Project } from "@/types/Project";
import ActionMenu from "@/components/utils/ActionMenu";
import apiRequest from "@/api/apiRequest";

type Props = {
  organizationId: number;
  slug: string;
  fetchAgain: boolean;
};

const OrganizationProjects = ({ organizationId, slug, fetchAgain }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    async function getAll() {
      const result = await apiRequest({
        method: "POST",
        endpoint: "/project/get-projects",
        body: {
          organizationId: organizationId,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setProjects(result.projects);
    }

    getAll();
  }, [organizationId, slug, fetchAgain, addToast]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const handleDelete = async (deleteId: number) => {
    try {
      const result = await apiRequest({
        method: "DELETE",
        endpoint: "/project/delete",
        body: {
          organizationId: organizationId,
          projectId: deleteId,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to load comments",
        "error",
      );
    }
  };

  return projects.length === 0 ? (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <p className="font-medium text-text">Projects Not Found</p>

      <p className="mt-1 text-sm text-gray-500">
        There are no projects to display.
      </p>
    </div>
  ) : (
    <section className="w-full my-4">
      <div className="flex w-full flex-col gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex justify-between  w-full flex-1  items-center">
              {/* Project info */}
              <div className="flex min-w-0 items-center gap-4">
                {/* Logo */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                  {project.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + description */}
                <div className="min-w-0">
                  <Link
                    to={`/dashboard/organizations/${slug}/projects/${project.slug}`}
                    className="block truncate text-base font-semibold text-text transition-colors hover:text-hover"
                  >
                    {project.name}
                  </Link>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {project.description || "No description provided."}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    <span title="Start Date" aria-label="Target Date">
                      {new Date(project.start_date).toLocaleDateString()}
                      &nbsp;--&gt;&nbsp;
                    </span>
                    <span title="Target Date" aria-label="Target Date">
                      {new Date(project.target_date).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1 px-2">
                {/* Role */}
                <span
                  title="Your role in this project"
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    project.role === "admin"
                      ? "bg-accent/10 text-accent"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {project.role}
                </span>
                <span
                  title="Project Status"
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold  ${
                    project.status === "ongoing"
                      ? "text-primary"
                      : project.status === "completed"
                        ? "text-accent"
                        : "text-gray-600"
                  }`}
                >
                  {project.status.toUpperCase()}
                </span>
              </div>
            </div>
            <ActionMenu
              isOpen={activeMenuId === project.id}
              onToggle={() =>
                setActiveMenuId((prev) =>
                  prev === project.id ? null : project.id,
                )
              }
              actions={[
                {
                  label: "Delete",
                  variant: "danger",
                  onClick: () => handleDelete(project.id),
                  confirm: {
                    title: "Delete Member",
                    message:
                      "Are you sure you want to remove this member from the team?",
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

export default OrganizationProjects;
