import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";

type Comment = {
  id: number;
  issue_id: number;
  user_id: number;
  content: string;
  edited_at: string | null;
  created_at: string;
  user_name?: string;
};

type Props = {
  issueId: number;
};

const IssueComments = ({ issueId }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    const getComments = async () => {
      try {
        setLoading(true);

        /*
         * Replace this with your actual API:
         *
         * const result = await getIssueComments(issueId);
         *
         * if (result.error) {
         *   addToast(result.message, "error");
         *   return;
         * }
         *
         * setComments(result.comments);
         */

        // Temporary until your comments API is connected.
        setComments([]);
      } catch (error) {
        addToast(
          error instanceof Error ? error.message : "Failed to load comments",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    getComments();
  }, [issueId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const content = comment.trim();

    if (!content) {
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Replace with:
       *
       * const result = await createIssueComment(issueId, content);
       *
       * if (result.error) {
       *   addToast(result.message, "error");
       *   return;
       * }
       *
       * setComments((prev) => [...prev, result.comment]);
       */

      setComment("");
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to add comment",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-5">
      <h3 className="text-sm font-semibold text-text">Comments</h3>

      {/* Comments */}
      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">
            No comments yet. Start the discussion.
          </p>
        ) : (
          comments.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-text">
                  {item.user_name ?? `User #${item.user_id}`}
                </p>

                <time className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </time>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {item.content}
              </p>

              {item.edited_at && (
                <p className="mt-2 text-xs text-gray-400">Edited</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add comment */}
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          maxLength={2000}
          disabled={submitting}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-400">{comment.length}/2000</span>

          <button
            type="submit"
            disabled={!comment.trim() || submitting}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueComments;
