import assignTeams from "@/api/team/assignTeams.api";
import getTeams from "@/api/team/getTeams.api";
import { useToast } from "@/context/ToastProvider";
import type { Team } from "@/types/Team";
import { useEffect, useState } from "react";
type Props = {
  organizationId: number;
  projectId: number;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const AssignTeamModal = ({
  organizationId,
  projectId,
  setFetchAgain,
}: Props) => {
  const { addToast } = useToast();
  const [openModal, setOpenModal] = useState(false);

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<Set<number>>(new Set());
  const teamIds = Array.from(selectedTeams);
  useEffect(() => {
    console.log("assing teams");
    async function getAll() {
      const result = await getTeams(organizationId, undefined);
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setTeams(result.teams);
    }

    getAll();
  }, []);
  const toggleTeam = (checkedTeamId: number) => {
    setSelectedTeams((prev) => {
      const next = new Set(prev);

      if (next.has(checkedTeamId)) {
        next.delete(checkedTeamId);
      } else {
        next.add(checkedTeamId);
      }
      return next;
    });
  };
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedTeams(new Set());
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (teamIds.length === 0) {
      addToast("Select At least one team", "warning");
      return;
    }
    try {
      const result = await assignTeams(teamIds, organizationId, projectId);

      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      setSelectedTeams(new Set());
      setFetchAgain((prev) => !prev);
      setOpenModal(false);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Something went wrong",
        "error",
      );
    }
  };
  console.log(teams);
  console.log(selectedTeams);
  return (
    <>
      <button
        type="button"
        className="btn btn-primary w-fit"
        onClick={() => setOpenModal(true)}
      >
        + Assing Teams
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
              <h2 className="text-xl font-semibold text-text">Assing Teams</h2>

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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
              {teams.map((team) => {
                const isSelected = selectedTeams.has(team.team_id);

                return (
                  <div
                    key={team.team_id}
                    className={`flex w-full flex-row gap-4 rounded-lg border p-3 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 cursor-pointer accent-primary"
                      id={`select-team-${team.team_id}`}
                      checked={isSelected}
                      onChange={() => toggleTeam(team.team_id)}
                    />

                    <label
                      htmlFor={`select-team-${team.team_id}`}
                      className="w-full cursor-pointer"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="flex flex-col">
                          <p className="font-medium text-text">{team.name}</p>
                          <p className="text-sm text-gray-500">
                            {team.description || "No description"}
                          </p>
                        </div>

                        <p className="text-sm capitalize text-gray-500">
                          {team.role}
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
                  className="btn btn-secondry"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={teamIds.length === 0}
                  className="btn btn-primary disabled:bg-gray-500"
                >
                  Assing Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignTeamModal;
