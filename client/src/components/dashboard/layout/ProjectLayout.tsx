import getSingleproject from "@/api/project/getSingleproject.api.ts";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Project } from "@/types/Project";

import { useToast } from "@/context/ToastProvider.tsx";

import type { OrganizationOutletContext } from "@/types/OrganizationOutletContext";

const ProjectLayout = () => {
  const [loading, setLoading] = useState(true);
  const { slug, projectId } = useParams<{
    slug: string;
    projectId: string;
  }>();
  const { addToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const { organization } = useOutletContext<OrganizationOutletContext>();

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !projectId) {
        return;
      }
      setLoading(true);
      const res = await getSingleproject(projectId, organization.id);
      console.log(res);
      if (res.error) {
        addToast(res.message, "error");
      }
      setProject(res.project);
      setLoading(false);
    };
    getResults();
  }, [slug, projectId]);

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
