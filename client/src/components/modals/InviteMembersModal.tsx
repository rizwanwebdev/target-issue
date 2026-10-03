import apiRequest from "@/api/apiRequest";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
type Props = {
  organizationId: number;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const InviteMembersModal = ({ organizationId, setFetchAgain }: Props) => {
  const { addToast } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setEmailInput(value);

    const mails = value
      .split(/[,;\n]+/)
      .map((mail) => mail.trim())
      .filter(Boolean);

    setEmails(mails);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (emails.length === 0) {
        addToast("There is no email to invite");
        return;
      }

      const result = await apiRequest({
        method: "POST",
        endpoint: "/org/invite",
        body: {
          organizationId: organizationId,
          emails: emails,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      setFetchAgain((prev) => !prev);
      addToast(result.message, "success");
      setEmails([]);
      setEmailInput("");
      setOpenModal(false);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Something went wrong",
        "error",
      );
    }
  };
  const hasInvalidEmail =
    emails.length === 0 || emails.some((email) => !EMAIL_REGEX.test(email));
  return (
    <>
      <button
        type="button"
        className="btn btn-primary w-fit"
        onClick={() => setOpenModal(true)}
      >
        + Invite Members
      </button>

      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setOpenModal(false);
            }
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-text">
                Invite Memebers
              </h2>

              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="btn btn-light"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-text"
                >
                  Enter Members Emails
                </label>
                <textarea
                  className="resize-none input-style"
                  name="emails"
                  id="emails"
                  onChange={handleChange}
                  value={emailInput}
                  placeholder="Enter Emails Commas Separated Or On New Line"
                  rows={6}
                  required
                />
              </div>
              {emails.length > 0 && (
                <div className="flex flex-wrap gap-2 border border-border p-3 rounded-xl">
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

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={hasInvalidEmail}
                  type="submit"
                  className="btn btn-primary disabled:bg-gray-500"
                >
                  Invite Members
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteMembersModal;
