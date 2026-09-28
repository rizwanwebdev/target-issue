import createOrg from "@/api/org/createOrg";
import { useToast } from "@/context/ToastProvider";
import { useState } from "react";
type Props = {
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};
const CreateOrgModal = ({ setFetchAgain }: Props) => {
  const { addToast } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [createSlug, setCreateSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);
      const credentials = Object.fromEntries(formData.entries());

      const result = await createOrg({
        name: String(credentials.name),
        slug: String(credentials.slug),
        description: String(credentials.description),
      });

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
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;

    if (!slugEdited) {
      setCreateSlug(
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true);

    setCreateSlug(
      e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-"),
    );
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-primary w-fit"
        onClick={() => setOpenModal(true)}
      >
        + Create Organization
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
                Create Organization
              </h2>

              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="btn btn-primary"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
              {/* Organization Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-text">
                  Organization Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  onChange={handleNameChange}
                  minLength={4}
                  placeholder="Enter organization name"
                  required
                  className="input-style"
                  title="More than 6 chracter. Use lowercase letters and single hyphens only, e.g. target-issue"
                />
              </div>

              {/* Organization Slug */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="slug" className="text-sm font-medium text-text">
                  Organization Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  name="slug"
                  value={createSlug}
                  onChange={handleSlugChange}
                  minLength={6}
                  placeholder="Enter organization slug, e.g. target-issue"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="Use lowercase letters, numbers, and single hyphens, e.g. target-issue"
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
                  placeholder="Enter organization description"
                  rows={5}
                  title="Please Fill Organization Description"
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
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateOrgModal;
