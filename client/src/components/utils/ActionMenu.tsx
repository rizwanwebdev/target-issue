import { useState } from "react";

export type ActionItem = {
  label: string;
  onClick: () => void;
  variant?: "danger" | "default";
  confirm?: {
    title: string;
    message: string;
    confirmText?: string;
  };
};

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  actions: ActionItem[];
};

const ActionMenu = ({ isOpen, onToggle, actions }: Props) => {
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  const handleActionClick = (action: ActionItem) => {
    onToggle();

    if (action.confirm) {
      setSelectedAction(action);
      return;
    }

    action.onClick();
  };

  const handleConfirm = () => {
    if (!selectedAction) return;

    selectedAction.onClick();
    setSelectedAction(null);
  };

  const handleCancel = () => {
    setSelectedAction(null);
  };

  return (
    <>
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className={`${
            isOpen ? "bg-gray-300" : ""
          } rounded px-0.5 py-1 transition-all duration-200`}
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
          <div className="absolute right-8 top-0 z-20 flex w-fit flex-col gap-1 rounded-xl border border-border bg-white p-2 shadow">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => handleActionClick(action)}
                className={
                  action.variant === "danger"
                    ? "rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    : "rounded px-3 py-2 text-left text-sm text-text hover:bg-gray-100"
                }
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedAction?.confirm && (
        <ConfirmationModal
          title={selectedAction.confirm.title}
          message={selectedAction.confirm.message}
          confirmText={selectedAction.confirm.confirmText}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default ActionMenu;
type ConfirmationModalProps = {
  title: string;
  message: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmationModal = ({
  title,
  message,
  confirmText = "Yes, Delete",
  onCancel,
  onConfirm,
}: ConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-text">{title}</h2>

        <p className="mt-2 text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn btn-light">
            No
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="btn bg-red-600 text-white hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
