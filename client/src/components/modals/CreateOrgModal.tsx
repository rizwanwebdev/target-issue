import createOrg from "@/api/org/createOrg";
import { useToast } from "@/context/ToastProvider";
import { useState } from "react";

const CreateOrgModal = () => {
  const { addToast } = useToast();
  const [openModal, setOpenModal] = useState(false);

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
                className="rounded-full px-2 py-1 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-text"
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
                  minLength={4}
                  placeholder="Enter organization name"
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  minLength={6}
                  placeholder="Enter organization slug, e.g. my-org"
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-text"
                >
                  Description
                  <span className="ml-1 font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter organization description"
                  rows={5}
                  maxLength={200}
                  className="resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
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
