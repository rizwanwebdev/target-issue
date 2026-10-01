import apiRequest from "@/api/apiRequest";
import { useToast } from "@/context/ToastProvider";
import { useState } from "react";
type Props = {
  organizationId: number;
  projectId: number;
  setFetchAgain?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateIssueModal = ({
  organizationId,
  projectId,
  setFetchAgain,
}: Props) => {
  const { addToast } = useToast();
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);
      const credentials = Object.fromEntries(formData.entries());
      const result = await apiRequest({
        method: "POST",
        endpoint: "/issues/create-issue",
        body: {
          organizationId: organizationId,
          projectId: projectId,
          title: String(credentials.name),
          description: String(credentials.description),
          due_date: String(credentials.due_date),
          priority: String(credentials.priority),
          severity: String(credentials.severity),
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      addToast(`${result.message}. Issue id: ${result.issueNumber}`, "success");

      form.reset();
      if (setFetchAgain) {
        setFetchAgain((prev) => !prev);
      }
      setOpenModal(false);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Something went wrong",
        "error",
      );
    }
  };
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <button
        type="button"
        className="btn btn-primary w-fit"
        onClick={() => setOpenModal(true)}
      >
        + Create Issue
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
              <h2 className="text-xl font-semibold text-text">Create Issue</h2>

              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="rounded-full px-2 py-1 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-text"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
              {/* Issue Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-text">
                  Issue Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  minLength={4}
                  placeholder="Enter Issue name"
                  required
                  className="input-style"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-text"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter Issue description"
                  rows={5}
                  title="Please Fill Issue Description"
                  maxLength={200}
                  required
                  className="resize-none input-style"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-text">
                  Issue Due Date
                </label>

                <input
                  type="date"
                  name="due_date"
                  placeholder="Enter Issue Due Date"
                  id="due_date"
                  defaultValue={today}
                  min={today}
                  required
                  className="input-style"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-text">
                  Select Issue Priority
                </label>

                <select
                  className="input-style"
                  name="priority"
                  defaultValue="low"
                  id="priority"
                  required
                >
                  <option value="low">LOW</option>
                  <option value="medium">MEDIUM</option>
                  <option value="high">HIGH</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-text">
                  Select Issue Severity
                </label>

                <select
                  className="input-style"
                  name="severity"
                  defaultValue="minor"
                  id="severity"
                  required
                >
                  <option value="minor">MINOR</option>
                  <option value="major">MAJOR</option>
                  <option value="critical">CRITICAL</option>
                  <option value="trivial">TRIVIAL</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  Create Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateIssueModal;
