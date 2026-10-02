import apiRequest from "@/api/apiRequest";
import { useToast } from "@/hooks/useToast";
import type { Member } from "@/types/Member";
import { useEffect, useState } from "react";

type Props = {
  organizationId: number;
  endpoint: string;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  projectId?: number;
};

const AssignMembersModal = ({
  endpoint,
  organizationId,
  setFetchAgain,
  projectId,
}: Props) => {
  const { addToast } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(
    new Set(),
  );
  const [membersLoading, setMembersLoading] = useState(true);

  const memberIds = Array.from(selectedMembers);

  useEffect(() => {
    if (!openModal || !membersLoading) return;

    async function getAllMembers() {
      try {
        const result = await apiRequest({
          method: "POST",
          endpoint: "/org/all-members",
          body: {
            organizationId: organizationId,
            projectId: undefined,
          },
        });

        if (result.error) {
          setMembers([]);
          addToast(result.message, "error");
          return;
        }

        setMembers(result.members);
      } catch (error) {
        addToast(
          error instanceof Error ? error.message : "Something went wrong",
          "error",
        );
      } finally {
        setMembersLoading(false);
      }
    }

    getAllMembers();
  }, [organizationId, addToast, openModal, membersLoading]);

  const toggleMember = (memberId: number) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);

      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }

      return next;
    });
  };

  // Close modal and clear selections with Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMembers(new Set());
        setOpenModal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleCloseModal = () => {
    setSelectedMembers(new Set());
    setOpenModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (memberIds.length === 0) {
      addToast("Select at least one team", "warning");
      return;
    }

    try {
      const result = await apiRequest({
        method: "POST",
        endpoint: endpoint, // dynamic url
        body: {
          organizationId: organizationId,
          projectId: projectId,
          memberIds: memberIds,
        },
      });

      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      addToast(result.message, "success");

      setSelectedMembers(new Set());
      setFetchAgain((prev) => !prev);
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
      {/* Don't show Assign Members while loading or when there are no Members */}
      <button
        type="button"
        className="btn btn-primary w-fit"
        onClick={() => setOpenModal(true)}
      >
        + Assign Members
      </button>

      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-text">
                Assign Members
              </h2>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-full px-2 py-1 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-text"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
              {members.map((member) => {
                const isSelected = selectedMembers.has(member.user_id);

                return (
                  <div
                    key={member.user_id}
                    className={`flex w-full flex-row gap-4 rounded-lg border p-3 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 cursor-pointer accent-primary"
                      id={`select-member-${member.user_id}`}
                      checked={isSelected}
                      onChange={() => toggleMember(member.user_id)}
                    />

                    <label
                      htmlFor={`select-member-${member.user_id}`}
                      className="w-full cursor-pointer"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="flex flex-col">
                          <p className="font-medium text-text">
                            {member.full_name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {member.joined_at || "No description"}
                          </p>
                        </div>

                        <p className="text-sm capitalize text-gray-500">
                          {member.role}
                        </p>
                      </div>
                    </label>
                  </div>
                );
              })}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={memberIds.length === 0}
                  className="btn btn-primary disabled:bg-gray-500"
                >
                  Assign Members
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignMembersModal;
