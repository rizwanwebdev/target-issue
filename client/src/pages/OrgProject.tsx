import { useParams } from "react-router-dom";

const OrgProject = () => {
  const { slug, project } = useParams<{ slug: string; project: string }>();

  return (
    <>
      OrgProject {slug} {project}
    </>
  );
};

export default OrgProject;
