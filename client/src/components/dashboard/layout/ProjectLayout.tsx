import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Project } from "@/types/Project";

import { useToast } from "@/hooks/useToast";

import type { OrganizationOutletContext } from "@/types/OutletContexts";
import apiRequest from "@/api/apiRequest";

const ProjectLayout = () => {
  const [loading, setLoading] = useState(true);
  const { slug, projectSlug } = useParams<{
    slug: string;
    projectSlug: string;
  }>();
  const { addToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const { organization } = useOutletContext<OrganizationOutletContext>();

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !projectSlug) {
        return;
      }
      setLoading(true);

      const result = await apiRequest({
        method: "POST",
        endpoint: "/project/project",
        body: {
          organizationId: organization.id,
          projectSlug: projectSlug,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
      }
      setProject(result.project);
      setLoading(false);
    };
    getResults();
  }, [slug, projectSlug, addToast, organization]);

  if (!project) {
    return null;
  }
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }
  return <Outlet context={{ organization, project }} />;
};

export default ProjectLayout;
