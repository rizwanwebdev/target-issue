import { useSearchParams } from "react-router-dom";

const Invitations = () => {
  const [searchParams] = useSearchParams();
  // http://localhost:5173/invitations?token=8434a14787965b02224c0117222ac498d7bfab525e04e49d58356d759a53dce6
  const token = searchParams.get("token");
  return <>Invitations {token}</>;
};

export default Invitations;
