import createTeam from "@/api/team/createTeam.api";
import { useToast } from "@/context/ToastProvider";
import { useState } from "react";
type Props = {
  organizationId: number;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateTeamModal = ({ organizationId, setFetchAgain }: Props) => {
  const { addToast } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [color, setColor] = useState("#000000");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);
      const credentials = Object.fromEntries(formData.entries());

      const result = await createTeam(
        organizationId,
        String(credentials.name),
        String(credentials.description),
        String(credentials.color),
      );

      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      setFetchAgain((prev) => !prev);
      addToast(result.message, "success");
      form.reset();
      setOpenModal(false);
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
        + Create Team
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
              <h2 className="text-xl font-semibold text-text">Create Team</h2>

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
              {/* Team Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-text">
                  Team Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  minLength={4}
                  placeholder="Enter Team name"
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
                  Pick Team Color
                </label>
                <div className="flex items-center flex-row gap-2 input-style">
                  <input
                    type="color"
                    name="color"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  />

                  <p>{color}</p>
                </div>
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
                  placeholder="Enter Team description"
                  rows={5}
                  title="Please Fill Team Description"
                  maxLength={200}
                  required
                  className="resize-none input-style"
                />
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

export default CreateTeamModal;
