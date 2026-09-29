import { useState } from "react";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

const ActionMenu = ({ isOpen, onToggle, onDelete }: Props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    onToggle(); // close dropdown
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      {/* Action button + menu */}
      <div className="relative">
        <button
          onClick={onToggle}
          className={`${
            isOpen ? "bg-gray-300" : ""
          } transition-all duration-200 px-0.5 py-1 rounded`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-8 top-0 z-20 w-fit rounded-xl border border-border bg-white p-2 shadow">
            <button onClick={handleDeleteClick} className="btn btn-primary">
              DELETE
            </button>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Delete</h2>

            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="rounded-lg border px-4 py-2"
              >
                No
              </button>

              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionMenu;
