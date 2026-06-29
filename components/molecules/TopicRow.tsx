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
          // DS collapsed Topic Row: items-start + 8px padding, 4px active left border.
          "flex w-full items-start justify-center border-l-4 p-2",
          active ? "border-sk-border-brand bg-sk-bg-brand-section" : "border-transparent",
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
          ? "border-sk-border-brand bg-sk-bg-brand-section"
          : "border-transparent hover:bg-sk-bg-secondary",
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
          {/* DS Sidebar v2: the topic title is text-primary in every state — it
              does not change colour when active or locked. */}
          <span className="sk-text-sm-medium block text-sk-text-primary">{title}</span>
          {/* Brand type badge (icon + label) + gray duration — matches DS Topic Row. */}
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            <TopicTypeBadge type={type} />
            <span className="sk-text-xs-regular text-sk-text-tertiary">· {duration}</span>
            {optional ? (
              <span className="sk-text-2xs-medium text-sk-text-tertiary">· Optional</span>
            ) : null}
          </span>
        </span>
      </button>
      {/* Trailing bookmark — hidden by default, shown when Show bookmark=true
          (the active row sets it on; see Sidebar). */}
      {showBookmark || active ? (
        <BookmarkButton
          bookmarked={bookmarked}
          onToggle={onToggleBookmark}
          itemLabel={title}
          size={16}
        />
      ) : null}
    </div>
  );
}
