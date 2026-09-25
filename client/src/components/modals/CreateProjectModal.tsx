import createProject from "@/api/project/createProject.api";
import { useToast } from "@/context/ToastProvider";
import { useState } from "react";
type Props = {
  organizationId: number;
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateProjectModal = ({
  organizationId,
  fetchAgain,
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

      const result = await createProject(
        organizationId,
        String(credentials.name),
        String(credentials.description),
        String(credentials.startDate),
        String(credentials.targetDate),
        String(credentials.project_status),
      );

      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      setFetchAgain(!fetchAgain);
      addToast(result.message, "success");
      form.reset();
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
        + Create Project
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
                Create Project
              </h2>

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
              {/* Project Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-text">
                  Project Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  minLength={4}
                  placeholder="Enter Project name"
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
                  placeholder="Enter Project description"
                  rows={5}
                  title="Please Fill Project Description"
                  maxLength={200}
                  required
                  className="resize-none input-style"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-text"
                >
                  Project Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  placeholder="Enter Project Start Date"
                  id="startDate"
                  defaultValue={today}
                  min={today}
                  required
                  className="input-style"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="targetDate"
                  className="text-sm font-medium text-text"
                >
                  Project Target Date
                </label>

                <input
                  type="date"
                  name="targetDate"
                  placeholder="Enter Project Target Date"
                  id="targetDate"
                  defaultValue={today}
                  min={today}
                  required
                  className="input-style"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-text">
                  Select Project Priority
                </label>
                <select
                  className="input-style"
                  name="project_status"
                  defaultValue="new"
                  id="project_status"
                  required
                >
                  <option value="new">New</option>
                  <option value="ongoing">On Going</option>
                  <option value="completed">Completed</option>
                  <option value="archive">Archive</option>
                </select>
              </div>

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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProjectModal;
