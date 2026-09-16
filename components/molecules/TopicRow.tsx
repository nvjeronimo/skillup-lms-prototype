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
  /** Active (currently playing) topic — brand-section bg + 4px brand left rule. */
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

/**
 * The Open row's 4px brand rule. In the DS it is an inside stroke, so it sits
 * over the padding instead of pushing the content — an absolutely positioned
 * bar reproduces that exactly (12px content inset in both states).
 */
function ActiveRule() {
  return <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-sk-fg-brand-primary" />;
}

/**
 * DS `LMS / Topic Row` (Topic Status × Tab Status). 68px on a one-line title:
 * 12/8/12/12 padding, 8px gap, an 18px Completion Status, then a state column
 * (title Body/Small/Medium, 4px, then badge · duration on one 20px line).
 */
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
          // DS collapsed Topic Row: 72×42, 12/8 padding, status dot centred.
          "relative flex w-full items-start justify-center px-2 py-3",
          active ? "bg-sk-bg-brand-section" : "hover:bg-sk-bg-secondary",
          className,
        )}
      >
        {active ? <ActiveRule /> : null}
        <CompletionStatus state={status} size={18} />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex items-start gap-2 py-3 pl-3 pr-2 transition-colors",
        active ? "bg-sk-bg-brand-section" : "hover:bg-sk-bg-secondary",
        className,
      )}
    >
      {active ? <ActiveRule /> : null}
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "true" : undefined}
        className="flex min-w-0 flex-1 items-start gap-2 text-left"
      >
        {/* 18px dot against a 20px title line: 1px down keeps it optically centred. */}
        <span className="mt-px">
          <CompletionStatus state={status} size={18} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          {/* The topic title is text-primary in every state — it does not change
              colour when active or locked. */}
          <span className="sk-text-sm-medium block text-sk-text-primary">{title}</span>
          {/* state-row: brand type badge · gray duration (Caption/Medium), 6px apart,
              on one line; the trailing duration truncates with an ellipsis. */}
          <span className="flex min-w-0 items-center gap-1.5">
            <TopicTypeBadge type={type} className="shrink-0" />
            {/* Duration is optional: render nothing rather than a dash placeholder. */}
            {duration ? (
              <>
                <span className="sk-text-sm-medium shrink-0 text-sk-text-tertiary" aria-hidden>
                  ·
                </span>
                <span className="sk-text-xs-medium min-w-0 truncate text-sk-text-tertiary">
                  {duration}
                </span>
              </>
            ) : null}
            {optional ? (
              <span className="sk-text-xs-medium shrink-0 text-sk-fg-quaternary">Optional</span>
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
