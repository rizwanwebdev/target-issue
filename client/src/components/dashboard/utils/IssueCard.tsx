import { useState } from "react";
import type { Issue } from "@/types/Issue";
import IssueComments from "@/components/dashboard/utils/IssueComments";
import { Link } from "react-router-dom";
type Props = {
  issue: Issue;
};

const IssueCard = ({ issue }: Props) => {
  const [showComments, setShowComments] = useState(false);
  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Issue */}
      <div className="p-5">
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
          <button type="button" className="btn btn-light">
            Edit
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && <IssueComments issueId={issue.id} />}
    </article>
  );
};

export default IssueCard;
