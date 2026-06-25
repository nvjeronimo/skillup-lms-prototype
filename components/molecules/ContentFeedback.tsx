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
    "sk-text-sm-medium inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-sk-bg-secondary";
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={onLike}
        aria-pressed={value === "like"}
        className={cn(btn, value === "like" ? "text-sk-text-success-primary" : "text-sk-text-tertiary")}
      >
        <Icon icon={ThumbsUp} size={18} />
        Like
      </button>
      <button
        type="button"
        onClick={onDislike}
        aria-pressed={value === "dislike"}
        className={cn(btn, value === "dislike" ? "text-sk-text-error-primary" : "text-sk-text-tertiary")}
      >
        <Icon icon={ThumbsDown} size={18} />
        Dislike
      </button>
      <button
        type="button"
        onClick={onReport}
        className={cn(btn, "text-sk-text-tertiary hover:text-sk-text-warning-primary")}
      >
        <Icon icon={AlertTriangle} size={18} />
        Report an issue
      </button>
    </div>
  );
}
