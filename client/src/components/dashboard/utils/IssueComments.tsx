import { useEffect, useRef, useState, type FormEvent } from "react";
import { useToast } from "@/hooks/useToast";
import apiRequest from "@/api/apiRequest";
import IssueCommentItem from "./IssueCommentItem";
export type IssueComment = {
  id: number;
  issueId: number;
  userId: number;
  parentId: number | null;
  content: string;
  editedAt: string | null;
  createdAt: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  children: IssueComment[];
};

type Props = {
  issueId: number;
  showComments: boolean;
  projectId: number;
  organizationId: number;
};

const IssueComments = ({
  issueId,
  projectId,
  organizationId,
  showComments,
}: Props) => {
  const [comments, setComments] = useState<IssueComment[]>([]);
  const [loading, setLoading] = useState(true);

  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [reply, setReply] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  // --------------------------------------------------
  // Fetch comments
  // --------------------------------------------------

  const hasFetchedComments = useRef(false);

  useEffect(() => {
    if (!showComments || hasFetchedComments.current) {
      return;
    }

    const getComments = async () => {
      try {
        setLoading(true);

        const result = await apiRequest({
          method: "GET",
          endpoint: "/issues/get-comments",
          body: {
            organizationId,
            projectId,
            issueId,
          },
        });

        if (result.error) {
          addToast(result.message, "error");
          return;
        }

        setComments(result.comments ?? []);
        hasFetchedComments.current = true;
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
  }, [showComments, organizationId, projectId, issueId, addToast]);

  // --------------------------------------------------
  // Add comment / reply
  // --------------------------------------------------

  const addComment = async (content: string, parentId: number | null) => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      setSubmitting(true);

      const result = await apiRequest({
        method: "POST",
        endpoint: "/issues/post-comment",
        body: {
          organizationId,
          projectId,
          issueId,
          comment: trimmedContent,
          parentId,
        },
      });

      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      const newComment: IssueComment = {
        ...result.comment,
        children: result.comment.children ?? [],
      };

      if (parentId === null) {
        // New top-level comment
        setComments((prev) => [...prev, newComment]);
      } else {
        // New reply
        setComments((prev) => addReplyToComment(prev, parentId, newComment));
      }

      if (parentId === null) {
        setComment("");
      } else {
        setReply("");
        setReplyTo(null);
      }
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to add comment",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Add reply recursively
  // --------------------------------------------------

  const addReplyToComment = (
    comments: IssueComment[],
    parentId: number,
    reply: IssueComment,
  ): IssueComment[] => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          children: [...comment.children, reply],
        };
      }

      if (comment.children.length > 0) {
        return {
          ...comment,
          children: addReplyToComment(comment.children, parentId, reply),
        };
      }

      return comment;
    });
  };

  // --------------------------------------------------
  // Submit top-level comment
  // --------------------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addComment(comment, null);
  };

  // --------------------------------------------------
  // Submit reply
  // --------------------------------------------------

  const handleReplySubmit = async (
    e: FormEvent<HTMLFormElement>,
    parentId: number,
  ) => {
    e.preventDefault();

    await addComment(reply, parentId);
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-5">
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

        <div className="flex items-start justify-between gap-3">
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
            <IssueCommentItem
              key={item.id}
              item={item}
              replyTo={replyTo}
              reply={reply}
              submitting={submitting}
              setReplyTo={setReplyTo}
              setReply={setReply}
              onReplySubmit={handleReplySubmit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default IssueComments;
