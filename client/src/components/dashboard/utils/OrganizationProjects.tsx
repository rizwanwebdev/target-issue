import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "@/context/ToastProvider.tsx";
import getProjects from "@/api/project/getProjects.api.ts";
import type { Project } from "@/types/Project";

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
      const result = await getProjects(organizationId);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setProjects(result.projects);
    }

    getAll();
  }, [organizationId, slug, fetchAgain]);

  return (
    projects.length > 0 && (
      <section className="w-full my-4">
        <div className="flex w-full flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            >
              {/* Project info */}
              <div className="flex min-w-0 items-center gap-4">
                {/* Logo */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                  {project.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + description */}
                <div className="min-w-0">
                  <Link
                    to={`/dashboard/organizations/${slug}/projects/${project.id}`}
                    className="block truncate text-base font-semibold text-text transition-colors hover:text-hover"
                  >
                    {project.name}
                  </Link>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {project.description || "No description provided."}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    <span title="Start Date" aria-label="Target Date">
                      {project.start_date.split("T")[0]}
                      &nbsp;--&gt;&nbsp;
                    </span>
                    <span title="Target Date" aria-label="Target Date">
                      {project.start_date.split("T")[0]}
                    </span>
                  </p>
                </div>
              </div>

              <div>
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
          ))}
        </div>
      </section>
    )
  );
};

export default OrganizationProjects;
