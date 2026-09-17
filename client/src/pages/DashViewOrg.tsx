import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastProvider.tsx";
import { useEffect, useState } from "react";
import inviteMemebers from "../api/org/inviteMembers.api.ts";
import getAllMembersApi, {
  type Members,
} from "../api/org/getAllMembers.api.ts";
const DashViewOrg = () => {
  const params = useParams();
  const slug = params.slug;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [emails, setEmails] = useState<[...string[]]>([]);
  const [members, setMembers] = useState<Members[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);

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

    try {
      if (emails.length === 0) {
        addToast("There is no email to invite");
        return;
      }
      if (!slug) {
        navigate(-1);
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
    async function getAll() {
      if (!slug) {
        navigate(-1);
        return;
      }
      const result = await getAllMembersApi(slug, page, limit);
      console.log(result);

      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setMembers(result.members);
      return;
    }

    getAll();
  }, [addToast]);
  return (
    <>
      <title>Members | Create & Manage</title>
      <meta name="description" content="Create and Manage Organizations" />

      <main className="bg-gray-50 p-4 md:px-8">
        <div className="min-h-screen flex flex-col items-center gap-4">
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
