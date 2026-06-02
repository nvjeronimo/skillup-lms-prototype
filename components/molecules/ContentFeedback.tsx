import * as React from "react";
import { AlertTriangle, ThumbsDown, ThumbsUp } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ContentFeedbackProps {
  value?: "like" | "dislike" | null;
  onLike?: () => void;
  onDislike?: () => void;
  onReport?: () => void;
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
  const btn =
    "lms-text-sm-medium inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-lms-bg-secondary";
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={onLike}
        aria-pressed={value === "like"}
        className={cn(btn, value === "like" ? "text-lms-text-success-primary" : "text-lms-text-tertiary")}
      >
        <Icon icon={ThumbsUp} size={18} />
        Like
      </button>
      <button
        type="button"
        onClick={onDislike}
        aria-pressed={value === "dislike"}
        className={cn(btn, value === "dislike" ? "text-lms-text-error-primary" : "text-lms-text-tertiary")}
      >
        <Icon icon={ThumbsDown} size={18} />
        Dislike
      </button>
      <button
        type="button"
        onClick={onReport}
        className={cn(btn, "text-lms-text-tertiary hover:text-lms-text-warning-primary")}
      >
        <Icon icon={AlertTriangle} size={18} />
        Report an issue
      </button>
    </div>
  );
}
