import { useNavigate, useSearchParams } from "react-router-dom";
import acceptInvitation from "@/api/org/acceptInvitation.api.ts";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastProvider.tsx";

const Invitations = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setloading] = useState(false);
  useEffect(() => {
    try {
      async function checkInvite() {
        setloading(true);
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
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Something went wrong",
        "error",
      );
    } finally {
      setloading(false);
    }
  }, [token, navigate, addToast]);
  return (
    <>
      <title>Accept Organization Invitation| Target Issue</title>
      <div className="flex min-h-screen justify-center items-center gap-2">
        <div>Invitations {token}</div>
        {loading && (
          <div className="w-full h-screen flex justify-center items-center">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Invitations;
