import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useToast } from "../../../context/ToastProvider.tsx";
import getOrg, { type Organization } from "../../../api/org/getOrg.api.ts";
const OrganizationLayout = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [organization, setOrganization] = useState<Organization | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrganization() {
      if (!slug) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setLoading(true);

      const result = await getOrg(slug);

      if (result.error || !result.organization) {
        if (result.status === 404) {
          navigate("/404", { replace: true });
          return;
        }

        addToast(result.message, "error");
        return;
      }

      setOrganization(result.organization);
      setLoading(false);
    }

    loadOrganization();
  }, [slug, navigate, addToast]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  return <Outlet context={{ organization }} />;
};

export default OrganizationLayout;
