"use client";

import * as React from "react";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { BookmarkButton } from "@/components/atoms/Bookmark";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { MOTION_MS } from "@/lib/motion/tokens";
import type { CompletionState, TopicType } from "@/lib/types";

export interface TopicRowProps {
  type: TopicType;
  title: string;
  duration: string;
  status: CompletionState;
  /** The topic was completed just now: its Done check draws itself (the completion chain). */
  animateStatus?: boolean;
  /** Active (currently playing) topic — brand-section bg + 4px brand left rule. */
  active?: boolean;
  showBookmark?: boolean;
  bookmarked?: boolean;
  optional?: boolean;
  /**
   * Why a Locked row cannot open, e.g. "Unlocks after Review 2". Read under the row (not on the
   * collapsed rail), the button's description, and announced politely when the learner tries the
   * row (it does not navigate).
   */
  lockedHint?: string;
  onClick?: () => void;
  onToggleBookmark?: () => void;
  /** The next topic to open after the current one: a quiet "Up next" tag. */
  upNext?: boolean;
  /** Collapsed sidebar shows only the status dot + active indicator. */
  collapsed?: boolean;
  className?: string;
}

/**
 * The Open row's 4px brand rule. In the DS it is an inside left stroke bound to
 * `border/primary`, so it sits over the padding instead of pushing the content —
 * an absolutely positioned bar in the same token reproduces that exactly (12px
 * content inset in both states).
 */
/** Spoken status, read after the title and type (the ring itself is visual). */
const STATUS_TEXT: Record<CompletionState, string> = {
  Done: "completed",
  "In Progress": "in progress",
  Pending: "not started",
  Locked: "locked",
};

function ActiveRule() {
  return <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-sko-border-primary" />;
}

/**
 * DS `LMS / Topic Row` (Topic Status × Tab Status). 68px on a one-line title:
 * 12/8/12/12 padding, 8px gap, an 18px Completion Status, then a state column
 * (title Body/Small/Medium, 4px, then badge · duration on one 20px line).
 */
/**
 * The locked row's polite announcement when the learner tries it (the reason itself is read under
 * the row; the 3 s tooltip went with the Course Journey, promoted by Nelson, 27 Oct 2026). It is
 * cleared and set again a moment later (short2), so a repeat activation is announced again.
 */
function useLockedHint(text: string | undefined) {
  const [shown, setShown] = React.useState(0);
  const [announcement, setAnnouncement] = React.useState("");
  React.useEffect(() => {
    if (!shown || !text) return;
    setAnnouncement("");
    // A short timer, not a frame: frames do not run in a background tab, the region must still speak.
    const t = window.setTimeout(() => setAnnouncement(text), MOTION_MS.short2);
    return () => window.clearTimeout(t);
  }, [shown, text]);
  return { announcement, show: () => setShown((n) => n + 1) };
}

export function TopicRow({
  type,
  title,
  duration,
  status,
  animateStatus = false,
  active = false,
  showBookmark = false,
  bookmarked = false,
  optional = false,
  upNext = false,
  lockedHint,
  onClick,
  onToggleBookmark,
  collapsed = false,
  className,
}: TopicRowProps) {
  const locked = status === "Locked";
  const hint = useLockedHint(lockedHint);
  const hintId = React.useId();
  /* The reason, for assistive tech: the button's description, and a polite announcement
     when the learner tries the row. */
  const lockedA11y =
    locked && lockedHint ? (
      <>
        <span id={hintId} className="sr-only">
          {lockedHint}
        </span>
        <span className="sr-only" aria-live="polite">
          {hint.announcement}
        </span>
      </>
    ) : null;

  if (collapsed) {
    return (
      <>
      <button
        type="button"
        // A locked topic does not open, here as in the expanded row; trying it announces why.
        onClick={locked ? (lockedHint ? hint.show : undefined) : onClick}
        // A roving-focus item of the sidebar list (one tab stop).
        data-roving
        aria-disabled={locked || undefined}
        aria-describedby={locked && lockedHint ? hintId : undefined}
        aria-current={active ? "page" : undefined}
        // Icon-only rail row: the name carries what the ring and badge show.
        aria-label={`${title}, ${type}, ${STATUS_TEXT[status]}${bookmarked ? ", bookmarked" : ""}${upNext ? ", up next" : ""}`}
        className={cn(
          // DS collapsed Topic Row: 72×42, 12/8 padding, status dot centred.
          "relative flex w-full items-start justify-center px-2 py-3 transition-colors",
          active ? "bg-sko-bg-primary-soft" : "hover:bg-sko-bg-subtle",
          className,
        )}
      >
        {active ? <ActiveRule /> : null}
        <span aria-hidden className="contents">
          <CompletionStatus state={status} size={18} animate={animateStatus} />
        </span>
      </button>
      {lockedA11y}
      </>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex items-start gap-2 py-3 pl-3 pr-2 transition-colors",
        active ? "bg-sko-bg-primary-soft" : "hover:bg-sko-bg-subtle",
        className,
      )}
    >
      {active ? <ActiveRule /> : null}
      <button
        type="button"
        onClick={locked ? (lockedHint ? hint.show : undefined) : onClick}
        data-roving
        aria-current={active ? "page" : undefined}
        aria-disabled={locked || undefined}
        aria-describedby={locked && lockedHint ? hintId : undefined}
        className="flex min-w-0 flex-1 items-start gap-2 text-left"
      >
        {/* DS: the 18px status sits flush with the top padding, level with the
            content column (row counter-axis alignment is MIN). Hidden from AT:
            the status is spoken last, after title · type · duration. */}
        <span aria-hidden className="contents">
          <CompletionStatus state={status} size={18} animate={animateStatus} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          {/* The topic title is text-primary in every state — it does not change
              colour when active or locked. */}
          <span className="sk-text-body-medium-medium block text-sko-text-default">{title}</span>
          {/* state-row: brand type badge · gray duration (Caption/Medium), 6px apart; the line
              wraps instead of truncating. */}
          <span className="flex min-w-0 flex-wrap items-center gap-1.5 gap-y-1">
            <TopicTypeBadge type={type} className="shrink-0" />
            {/* Duration is optional: render nothing rather than a dash placeholder. */}
            {duration ? (
              <>
                <span className="sk-text-body-medium-medium shrink-0 text-sko-text-subtle" aria-hidden>
                  ·
                </span>
                <span className="sk-text-body-small-medium min-w-0 whitespace-nowrap text-sko-text-subtle">
                  {duration}
                </span>
              </>
            ) : null}
            {optional ? (
              <span className="sk-text-body-small-medium shrink-0 text-sko-icon-faint">Optional</span>
            ) : null}
            {upNext ? (
              <span className="sk-text-label-small-semibold shrink-0 text-sko-text-primary">Up next</span>
            ) : null}
            <span className="sr-only">, {STATUS_TEXT[status]}</span>
          </span>
          {/* The reason is read where the row is, before anyone tries it. */}
          {locked && lockedHint ? (
            <span aria-hidden className="sk-text-body-small-regular flex items-start gap-1 text-sko-text-subtle">
              <Icon icon={Lock} size={14} className="mt-0.5 shrink-0" />
              {lockedHint}
            </span>
          ) : null}
        </span>
      </button>
      {lockedA11y}
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
