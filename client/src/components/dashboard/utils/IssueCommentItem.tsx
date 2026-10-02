import type { FormEvent } from "react";
import type { IssueComment } from "./IssueComments";

type Props = {
  item: IssueComment;
  depth?: number;
  replyTo: number | null;
  reply: string;
  submitting: boolean;
  setReplyTo: React.Dispatch<React.SetStateAction<number | null>>;
  setReply: React.Dispatch<React.SetStateAction<string>>;
  onReplySubmit: (e: FormEvent<HTMLFormElement>, parentId: number) => void;
};

const IssueCommentItem = ({
  item,
  depth = 0,
  replyTo,
  reply,
  submitting,
  setReplyTo,
  setReply,
  onReplySubmit,
}: Props) => {
  const isReplying = replyTo === item.id;

  return (
    <div className={depth > 0 ? "ml-6 border-l border-gray-200 pl-4" : ""}>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="whitespace-pre-wrap text-sm leading-6 text-text">
          {item.content}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-500">
            By: @{item.username}
          </p>

          <time className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleString()}
          </time>
        </div>

        {item.editedAt && <p className="mt-2 text-xs text-gray-400">Edited</p>}

        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              setReplyTo((prev) => (prev === item.id ? null : item.id));
              setReply("");
            }}
            className="text-xs font-medium text-primary hover:text-hover"
          >
            {isReplying ? "Cancel Reply" : "Reply"}
          </button>
        </div>
      </div>

      {isReplying && (
        <form
          onSubmit={(e) => onReplySubmit(e, item.id)}
          className="mt-3 ml-2 flex flex-col gap-2"
        >
          <textarea
            autoFocus
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={`Reply to @${item.username}...`}
            rows={2}
            maxLength={2000}
            disabled={submitting}
            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-400">{reply.length}/2000</span>

            <div className="flex gap-3 ">
              <button
                type="button"
                onClick={() => {
                  setReplyTo((prev) => (prev === item.id ? null : item.id));
                  setReply("");
                }}
                className="text-xs font-medium  btn  text-primary hover:text-hover"
              >
                {isReplying ? "Cancel Reply" : "Reply"}
              </button>
              <button
                type="submit"
                disabled={!reply.trim() || submitting}
                className="btn btn-primary text-xs disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Reply"}
              </button>
            </div>
          </div>
        </form>
      )}

      {item.children.length > 0 && (
        <div className="mt-3 flex flex-col gap-3">
          {item.children.map((child) => (
            <IssueCommentItem
              key={child.id}
              item={child}
              depth={depth + 1}
              replyTo={replyTo}
              reply={reply}
              submitting={submitting}
              setReplyTo={setReplyTo}
              setReply={setReply}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueCommentItem;
