import { useState } from "react";
export type UserRole = "admin" | "member" | "viewer";

export type ActionItem = {
  label: string;
  onClick: () => void;
  variant?: "danger" | "default";
  roles?: UserRole[];
  visible?: boolean;
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
  role?: UserRole;
};

const ActionMenu = ({ isOpen, onToggle, actions, role }: Props) => {
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
  const visibleActions = actions.filter(
    (action) =>
      action.visible !== false &&
      (!action.roles || (role && action.roles.includes(role))),
  );
  return (
    <>
      {visibleActions.length > 0 && (
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onToggle}
            aria-label="Open actions"
            className={`rounded px-0.5 py-1 transition-all duration-200 ${
              isOpen ? "bg-gray-300" : ""
            }`}
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
            <div className="absolute right-8 top-0 z-20 flex w-fit flex-col rounded border-x border-t border-gray-400 bg-white">
              {visibleActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleActionClick(action)}
                  className={`w-full border-b border-b-gray-400 px-6 py-2 text-center text-sm transition-all duration-200 ${
                    action.variant === "danger"
                      ? "hover:bg-red-400 hover:text-white"
                      : "text-text hover:bg-gray-200"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
