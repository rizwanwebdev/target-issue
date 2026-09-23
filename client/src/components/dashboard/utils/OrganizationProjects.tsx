import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "@/context/ToastProvider.tsx";
import getProjects, { type Project } from "@/api/project/getProjects.api.ts";
import type { Organization } from "@/api/org/getOrg.api.ts";

type Props = {
  slug: string;
  organization?: Organization;
};

const OrganizationProjects = ({ slug, organization }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    async function getAll() {
      const result = await getProjects(slug);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setProjects(result.projects);
    }

    getAll();
  }, [slug, addToast, organization]);

  return (
    projects.length > 0 && (
      <section className="w-full py-4">
        <div>
          <h2 className="text-4xl font-semibold text-center my-2">
            Organization Projects
          </h2>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-full flex flex-col flex-wrap justify-between border border-gray-400 p-2 rounded-lg"
            >
              <div className="flex flex-row flex-wrap justify-between">
                <Link
                  className="text-indigo-600"
                  to={`/dashboard/organizations/${slug}/projects/${project.id}`}
                >
                  {project.name}
                </Link>
                <span className="text-green-600">{project.status}</span>
                <span className="text-indigo-600">{project.role}</span>
              </div>
              <div className="flex flex-col">
                <span>{project.description}</span>
                <div className="flex flex-col">
                  <span className="text-indigo-600">
                    Start Date:{project.start_date.split("T")[0]}
                  </span>
                  <span className="text-green-600">
                    Target Date: {project.target_date.split("T")[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  );
};

export default OrganizationProjects;
