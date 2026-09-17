import { useParams } from "react-router-dom";

const DashViewOrg = () => {
  const params = useParams();

  const slug = params.slug;
  return (
    <>
      <div>{slug}</div>
    </>
  );
};

export default DashViewOrg;
