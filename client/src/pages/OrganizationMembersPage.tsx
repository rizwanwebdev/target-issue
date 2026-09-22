import { useParams } from "react-router-dom";
import OrganizationMembers from "../components/utils/OrganizationMembers.tsx";
const OrganizationMemebersPage = () => {
  const { slug } = useParams<{ slug: string }>();
  return slug && <OrganizationMembers slug={slug} />;
};

export default OrganizationMemebersPage;
