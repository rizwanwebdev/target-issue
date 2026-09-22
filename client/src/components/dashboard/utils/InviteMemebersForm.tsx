import { useState } from "react";
import inviteMemebers from "../../../api/org/inviteMembers.api.ts";
import { useToast } from "../../../context/ToastProvider.tsx";
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
type Params = {
  slug: string;
};
const InviteMemebersForm = ({ slug }: Params) => {
  const { addToast } = useToast();
  const [emails, setEmails] = useState<string[]>([]);

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

    try {
      if (emails.length === 0) {
        addToast("There is no email to invite");
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
      <section>
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
            required
            placeholder="Enter Emails Comma seprated or on new line"
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
      </section>
    </>
  );
};

export default InviteMemebersForm;
