import { useParams } from "react-router-dom";
import OrganizationProjects from "../components/utils/OrganizationProjects.tsx";
const OrganizationProjectsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  return slug && <OrganizationProjects slug={slug} />;
};

export default OrganizationProjectsPage;
