import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastProvider.tsx";
import { useEffect, useState } from "react";

import getOrg, { type Organization } from "../api/org/getOrg.api.ts";
import InviteMemebersForm from "../components/utils/InviteMemebersForm.tsx";
import CreateProjectForm from "../components/utils/CreateProjectForm.tsx";
import CreateTeamForm from "../components/utils/CreateTeamForm.tsx";
import OrganizationMembers from "../components/utils/OrganizationMembers.tsx";
import OrganizationProjects from "../components/utils/OrganizationProjects.tsx";
import OragnizationTeams from "../components/utils/OragnizationTeams.tsx";

const DashViewOrg = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [isActive, setIsActive] = useState("invite");

  useEffect(() => {
    async function getOrganization() {
      if (!slug) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setLoadingOrg(true);

      const result = await getOrg(slug);

      if (result.error || !result.organization) {
        setLoadingOrg(false);

        if (result.status === 404) {
          navigate("/404", { replace: true });
          return;
        }

        addToast(result.message, "error");
        return;
      }

      setOrganization(result.organization);
      setLoadingOrg(false);
    }

    getOrganization();
  }, [slug, navigate, addToast]);

  useEffect(() => {
    document.title = organization
      ? `${organization.name} | Create & Manage`
      : "Organization | Create & Manage";
  }, [organization]);

  if (loadingOrg) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <meta name="description" content="Create and Manage Organizations" />

      <main className="bg-gray-50 p-4 md:px-8">
        <div className="min-h-screen flex flex-col items-center gap-4">
          <div className="p-4 border w-full">
            <p>{organization?.name}</p>
            <p>{organization?.description}</p>
          </div>

          {isAdmin && (
            <div className="w-full space-y-4">
              <div className="flex flex-row flex-wrap items-center justify-between gap-2 w-full border p-4 *:border *:rounded-lg *:p-2 *:cursor-pointer">
                <button
                  className={
                    isActive === "invite"
                      ? "bg-black text-white font-semibold"
                      : ""
                  }
                  onClick={() => setIsActive("invite")}
                >
                  Invite Members
                </button>

                <button
                  className={
                    isActive === "project"
                      ? "bg-black text-white font-semibold"
                      : ""
                  }
                  onClick={() => setIsActive("project")}
                >
                  Create Project
                </button>

                <button
                  className={
                    isActive === "team"
                      ? "bg-black text-white font-semibold"
                      : ""
                  }
                  onClick={() => setIsActive("team")}
                >
                  Create Team
                </button>
              </div>

              {slug && isAdmin && (
                <div>
                  {isActive === "invite" && <InviteMemebersForm slug={slug} />}

                  {isActive === "project" && <CreateProjectForm slug={slug} />}

                  {isActive === "team" && <CreateTeamForm slug={slug} />}
                </div>
              )}
            </div>
          )}

          {slug && organization && (
            <>
              <OragnizationTeams slug={slug} organization={organization} />
              <OrganizationProjects slug={slug} organization={organization} />
              <OrganizationMembers
                slug={slug}
                organization={organization}
                setIsAdmin={setIsAdmin}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default DashViewOrg;
