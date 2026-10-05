import { useToast } from "@/hooks/useToast";
import { useEffect, useState } from "react";
import IssueCard from "./IssueCard";
import type { Issue } from "@/types/Issue";
import apiRequest from "@/api/apiRequest";
type Props = {
  organizationId: number;
  slug: string;
  projectId?: number;
  fetchAgain?: boolean;
  setFetchAgain?: React.Dispatch<React.SetStateAction<boolean>>;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const OrganizationIssues = ({
  organizationId,
  projectId,
  fetchAgain,
  setFetchAgain,
}: Props) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    async function getAll() {
      setLoading(true);

      const result = await apiRequest({
        method: "POST",
        endpoint: "/issues/get-issues",
        body: {
          organizationId: organizationId,
          projectId: projectId,
          page: page,
        },
      });

      if (result.error) {
        addToast(result.message, "error");
        setIssues([]);
        setLoading(false);
        return;
      }

      setIssues(result.issues);
      setPagination(result.pagination);

      setLoading(false);
    }

    getAll();
  }, [organizationId, projectId, page, fetchAgain, addToast]);

  return (
    <section className="flex flex-col gap-4">
      {/* Issues */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">Loading issues...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="font-medium text-text">No issues found</p>

          <p className="mt-1 text-sm text-gray-500">
            There are no issues to display.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {issues.map((issue) => (
            <IssueCard
              setFetchAgain={setFetchAgain}
              key={issue.id}
              organizationId={organizationId}
              issue={issue}
              projectId={projectId}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={page === 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
            className="btn btn-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <button
            type="button"
            disabled={page >= pagination.totalPages || loading}
            onClick={() => setPage((prev) => prev + 1)}
            className="btn btn-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default OrganizationIssues;
