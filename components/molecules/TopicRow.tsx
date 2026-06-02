import * as React from "react";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { BookmarkButton } from "@/components/atoms/Bookmark";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { cn } from "@/lib/utils";
import type { CompletionState, TopicType } from "@/lib/types";

export interface TopicRowProps {
  type: TopicType;
  title: string;
  duration: string;
  status: CompletionState;
  /** Active (currently playing) topic — brand-section bg + 4px brand left border. */
  active?: boolean;
  showBookmark?: boolean;
  bookmarked?: boolean;
  optional?: boolean;
  onClick?: () => void;
  onToggleBookmark?: () => void;
  /** Collapsed sidebar shows only the status dot + active indicator. */
  collapsed?: boolean;
  className?: string;
}

/** A single navigable topic in the sidebar. */
export function TopicRow({
  type,
  title,
  duration,
  status,
  active = false,
  showBookmark = false,
  bookmarked = false,
  optional = false,
  onClick,
  onToggleBookmark,
  collapsed = false,
  className,
}: TopicRowProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "true" : undefined}
        aria-label={title}
        className={cn(
          "flex h-10 w-full items-center justify-center border-l-4",
          active ? "border-lms-border-brand bg-lms-bg-brand-section" : "border-transparent",
          className,
        )}
      >
        <CompletionStatus state={status} size={20} />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-2.5 border-l-4 px-3 py-2.5 transition-colors",
        active
          ? "border-lms-border-brand bg-lms-bg-brand-section"
          : "border-transparent hover:bg-lms-bg-secondary",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "true" : undefined}
        className="flex flex-1 items-start gap-2.5 text-left"
      >
        <span className="mt-0.5">
          <CompletionStatus state={status} size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "lms-text-sm-medium block",
              active ? "text-lms-text-brand-secondary" : "text-lms-text-primary",
              status === "Locked" && "text-lms-text-tertiary",
            )}
          >
            {title}
          </span>
          {/* Brand type badge (icon + label) + gray duration — matches DS Topic Row. */}
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            <TopicTypeBadge type={type} />
            <span className="lms-text-xs-regular text-lms-text-tertiary">· {duration}</span>
            {optional ? (
              <span className="lms-text-2xs-medium text-lms-text-tertiary">· Optional</span>
            ) : null}
          </span>
        </span>
      </button>
      {showBookmark || active ? (
        <span className={cn(active ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
          <BookmarkButton
            bookmarked={bookmarked}
            onToggle={onToggleBookmark}
            itemLabel={title}
            size={16}
          />
        </span>
      ) : null}
    </div>
  );
}
