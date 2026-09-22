import { useParams } from "react-router-dom";

const OrgMember = () => {
  const { slug, member } = useParams<{ slug: string; member: string }>();

  return (
    <>
      OrgMember {slug} {member}
    </>
  );
};

export default OrgMember;
