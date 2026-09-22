import { useParams } from "react-router-dom";

const OrgTeam = () => {
  const { slug, team } = useParams<{ slug: string; team: string }>();

  return (
    <>
      OrgTeam {slug} {team}
    </>
  );
};

export default OrgTeam;
