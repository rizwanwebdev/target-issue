import { useParams } from "react-router-dom";
import OragnizationTeams from "../components/utils/OragnizationTeams.tsx";
const OrganizationTeamsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  return slug && <OragnizationTeams slug={slug} />;
};

export default OrganizationTeamsPage;
