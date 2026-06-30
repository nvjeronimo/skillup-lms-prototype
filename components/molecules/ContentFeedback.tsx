"use client";

import * as React from "react";
import { AlertTriangle, ThumbsDown, ThumbsUp } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ReportIssueModal, type ReportIssuePayload } from "@/components/organisms/ReportIssueModal";
import { cn } from "@/lib/utils";

export interface ContentFeedbackProps {
  value?: "like" | "dislike" | null;
  onLike?: () => void;
  onDislike?: () => void;
  /** Called when a report is submitted from the modal. */
  onReport?: (payload: ReportIssuePayload) => void;
  className?: string;
}

/** Inline like / dislike / report row at the bottom of content blocks. */
export function ContentFeedback({
  value = null,
  onLike,
  onDislike,
  onReport,
  className,
}: ContentFeedbackProps) {
  const [reportOpen, setReportOpen] = React.useState(false);
  const liked = value === "like";
  const disliked = value === "dislike";
  const btn =
    "sk-text-sm-medium inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-sk-bg-secondary";
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={onLike}
        aria-pressed={liked}
        className={cn(btn, liked ? "text-sk-fg-like" : "text-sk-text-tertiary")}
      >
        <Icon icon={ThumbsUp} size={18} fill={liked ? "currentColor" : "none"} />
        Like
      </button>
      <button
        type="button"
        onClick={onDislike}
        aria-pressed={disliked}
        className={cn(btn, disliked ? "text-sk-text-error-primary" : "text-sk-text-tertiary")}
      >
        <Icon icon={ThumbsDown} size={18} fill={disliked ? "currentColor" : "none"} />
        Dislike
      </button>
      <button
        type="button"
        onClick={() => setReportOpen(true)}
        className={cn(btn, "text-sk-text-tertiary hover:text-sk-text-warning-primary")}
      >
        <Icon icon={AlertTriangle} size={18} />
        Report an issue
      </button>

      <ReportIssueModal
        open={reportOpen}
        onCancel={() => setReportOpen(false)}
        onSubmit={(payload) => {
          setReportOpen(false);
          onReport?.(payload);
        }}
      />
    </div>
  );
}
