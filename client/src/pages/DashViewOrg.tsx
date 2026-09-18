import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastProvider.tsx";
import { useEffect, useState } from "react";
import inviteMemebers from "../api/org/inviteMembers.api.ts";
import getAllMembersApi, {
  type Members,
} from "../api/org/getAllMembers.api.ts";
import getOrg, { type Organization } from "../api/org/getOrg.api.ts";

const DashViewOrg = () => {
  const params = useParams();
  const slug = params.slug;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [emails, setEmails] = useState<[...string[]]>([]);
  const [members, setMembers] = useState<Members[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  console.log(members);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);

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

  const handleChanage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);

    const mails = e.target.value;
    const EMAILREGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    mails.split(",").some((mail) => {
      if (!EMAILREGEX.test(mail)) {
        addToast(`Invalid Emails: ${mail}`, "warning");
      }
    });
    setEmails(mails.split(","));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAdmin) {
      return;
    }

    try {
      if (emails.length === 0) {
        addToast("There is no email to invite");
        return;
      }
      if (!slug) {
        navigate("/dashboard");
        return;
      }
      const result = await inviteMemebers(slug, emails);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      addToast(result.message, "success");
      setEmails([]);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Something went wrong",
        "error",
      );
    }
  };
  useEffect(() => {
    document.title = organization
      ? `${organization.name} | Create & Manage`
      : "Organization | Create & Manage";
  }, [organization]);
  useEffect(() => {
    if (!organization || !slug) {
      return;
    }

    async function getAll() {
      if (!slug) {
        navigate("/dashboard");
        return;
      }
      const result = await getAllMembersApi(slug, page, limit);
      console.log(result);

      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setMembers(result.members);
      setIsAdmin(result.requester.isAdmin);
      return;
    }

    getAll();
  }, [organization, slug, page, limit, addToast]);

  console.log(organization);
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
            <div className="max-w-md w-full">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col *:border *:p-2 gap-3"
              >
                <textarea
                  name="description"
                  id="description"
                  onChange={handleChanage}
                  rows={6}
                ></textarea>

                <button type="submit" className="cursor-pointer">
                  Invite Memebers
                </button>
              </form>
            </div>
          )}
          <div className="flex flex-col items-center w-full gap-4">
            {members.map((member) => (
              <div
                key={member.user_id}
                className="w-full flex flex-col flex-wrap justify-between border border-gray-400 p-2 rounded-lg"
              >
                <div className="flex flex-row flex-wrap justify-between ">
                  <Link
                    className="text-indigo-600"
                    to={`/dashboard/organizations/${slug}/members/${member.user_id}`}
                  >
                    {member.full_name}
                  </Link>
                  <span className="text-green-600">{member.role}</span>
                  <span className="text-green-600">{member.joined_at}</span>
                </div>
                <span>{member.email}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default DashViewOrg;
