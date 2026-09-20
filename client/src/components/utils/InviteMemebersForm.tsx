import { useState } from "react";
import inviteMemebers from "../../api/org/inviteMembers.api.ts";
import { useToast } from "../../context/ToastProvider.tsx";
import { useNavigate, useParams } from "react-router-dom";
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
type Params = {
  isAdmin: boolean;
};
const InviteMemebersForm = ({ isAdmin }: Params) => {
  const { addToast } = useToast();
  const [emails, setEmails] = useState<string[]>([]);

  const params = useParams();
  const slug = params.slug;
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const mails = e.target.value;

    setEmails(
      mails
        .split(/[,;\n]+/)
        .map((mail) => mail.trim())
        .filter(Boolean),
    );
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
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col *:border *:p-2 gap-3"
      >
        <textarea
          name="description"
          id="description"
          onChange={handleChange}
          value={emails}
          rows={6}
        ></textarea>
        {emails.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {emails.map((email, index) => {
              const isValid = EMAIL_REGEX.test(email);

              return (
                <span
                  key={`${email}-${index}`}
                  className={`rounded-md px-2 py-1 text-sm ${
                    isValid
                      ? "bg-yellow-200 text-yellow-900"
                      : "bg-red-200 text-red-900"
                  }`}
                >
                  {email}
                </span>
              );
            })}
          </div>
        )}

        <button
          type="submit"
          className="cursor-pointer active:scale-95 transition-all duration-200"
        >
          Invite Memebers
        </button>
      </form>
    </>
  );
};

export default InviteMemebersForm;
