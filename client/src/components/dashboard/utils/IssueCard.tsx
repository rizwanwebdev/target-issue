import { useState } from "react";
import type { Issue } from "@/types/Issue";
import IssueComments from "@/components/dashboard/utils/IssueComments";
import ActionMenu from "@/components/utils/ActionMenu";
import apiRequest from "@/api/apiRequest";
import { useToast } from "@/hooks/useToast";
import { useOutletContext } from "react-router-dom";
import type { ProjectOutletContext } from "@/types/OutletContexts";
import useAuth from "@/hooks/useAuth";
type Props = {
  issue: Issue;
  projectId?: number;
  organizationId: number;
  setFetchAgain?: React.Dispatch<React.SetStateAction<boolean>>;
};

const IssueCard = ({
  issue,
  projectId,
  organizationId,
  setFetchAgain,
}: Props) => {
  const { user } = useAuth();
  const { project } = useOutletContext<ProjectOutletContext>();
  const [showComments, setShowComments] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const { addToast } = useToast();
  const handleDelete = async (deleteId: number) => {
    try {
      if (!organizationId || !projectId || !deleteId) return;
      const result = await apiRequest({
        method: "DELETE",
        endpoint: "/issues/delete",
        body: {
          organizationId: organizationId,
          projectId: projectId,
          issueId: deleteId,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      if (setFetchAgain) {
        setFetchAgain((prev) => !prev);
      }
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to load comments",
        "error",
      );
    }
  };

  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Issue */}
      <div className="flex justify-between p-5">
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">
                #{issue.issue_number}
              </p>

              <h2 className="mt-1 text-lg font-semibold text-text">
                {issue.title}
              </h2>
            </div>

            <span className="rounded-full border border-gray-300  px-3 py-1 text-xs font-medium capitalize text-gray-600">
              {issue.status}
            </span>
          </div>

          {/* Description */}
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {issue.description}
          </p>

          {/* Metadata */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
              Priority: {issue.priority}
            </span>

            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium capitalize text-red-600">
              Severity: {issue.severity}
            </span>

            <span className="rounded-full  px-3 py-1 text-xs text-gray-600">
              Due: {new Date(issue.due_date).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-4 text-sm">
            <span>Issue In: </span>
            <span>{issue.project_name}</span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setShowComments((prev) => !prev)}
              className="btn btn-light"
            >
              {showComments ? "Hide comments" : "View comments"}
            </button>
            {/* Future actions */}
            {projectId && (
              <button type="button" className="btn btn-light">
                Edit
              </button>
            )}
          </div>
        </div>

        <ActionMenu
          isOpen={activeMenuId === issue.id}
          onToggle={() =>
            setActiveMenuId((prev) => (prev === issue.id ? null : issue.id))
          }
          role={project.role}
          actions={[
            {
              label: "Delete",
              roles: ["admin", "member"],
              visible:
                user?.id === issue.created_by || project.role === "admin",
              variant: "danger",
              onClick: () => handleDelete(issue.id),
              confirm: {
                title: "Delete Issue",
                message:
                  "Are you sure you want to delete this issue? This action cannot be undone.",
                confirmText: "Yes, Delete",
              },
            },
          ]}
        />
      </div>
      <div className={showComments ? "block" : "hidden"}>
        <IssueComments
          showComments={showComments}
          issueId={issue.id}
          projectId={issue.project_id}
          organizationId={issue.organization_id}
        />
      </div>
    </article>
  );
};

export default IssueCard;
