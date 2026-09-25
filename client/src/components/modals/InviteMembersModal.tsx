import inviteMemebers from "@/api/org/inviteMembers.api";
import { useToast } from "@/context/ToastProvider";
import { useState } from "react";
type Props = {
  organizationId: number;
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const InviteMembersModal = ({
  organizationId,
  fetchAgain,
  setFetchAgain,
}: Props) => {
  const { addToast } = useToast();
  const [openModal, setOpenModal] = useState(false);
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

      const result = await inviteMemebers(organizationId, emails);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      setFetchAgain(!fetchAgain);
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
                  value={emails}
                  placeholder="Enter Emails Commas Seperate Or On New Line"
                  rows={6}
                  required
                ></textarea>
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
                  className="btn btn-secondry"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  Create Team
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
