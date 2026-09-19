import { useNavigate, useSearchParams } from "react-router-dom";
import acceptInvitation from "../api/org/acceptInvitation.api.ts";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastProvider.tsx";

const Invitations = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const navigate = useNavigate();
  // example http://localhost:5173/invitations?token=f93697a614b47ef7042216838ccd18800478fa3f7d338311253057a28b655bb3
  const token = searchParams.get("token");

  const [loading, setloading] = useState(false);
  useEffect(() => {
    try {
      setloading(true);

      async function checkInvite() {
        if (!token) {
          return;
        }
        const result = await acceptInvitation(token);
        if (result.error) {
          addToast(result.message, "error");
          return;
        }
        navigate("/dashboard/organizations");
        addToast(result.message, "success");
      }
      checkInvite();
    } catch (error: any) {
      addToast(error.message, "error");
    } finally {
      setloading(false);
    }
  }, [token]);
  return (
    <>
      <title>Accept Organization Invitation| Target Issue</title>
      <div className="flex min-h-screen justify-center items-center gap-2">
        <div>Invitations {token}</div>
        {loading && <div>Loading......</div>}
      </div>
    </>
  );
};

export default Invitations;
