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
    "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-lms-bg-secondary";
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="lms-text-sm-regular mr-1 text-lms-text-tertiary">Was this helpful?</span>
      <button
        type="button"
        onClick={onLike}
        aria-pressed={value === "like"}
        aria-label="Like"
        className={cn(btn, value === "like" ? "text-lms-text-success-primary" : "text-lms-text-tertiary")}
      >
        <Icon icon={ThumbsUp} size={18} />
      </button>
      <button
        type="button"
        onClick={onDislike}
        aria-pressed={value === "dislike"}
        aria-label="Dislike"
        className={cn(btn, value === "dislike" ? "text-lms-text-error-primary" : "text-lms-text-tertiary")}
      >
        <Icon icon={ThumbsDown} size={18} />
      </button>
      <button
        type="button"
        onClick={onReport}
        aria-label="Report"
        className={cn(btn, "text-lms-text-tertiary hover:text-lms-text-warning-primary")}
      >
        <Icon icon={AlertTriangle} size={18} />
      </button>
    </div>
  );
}
