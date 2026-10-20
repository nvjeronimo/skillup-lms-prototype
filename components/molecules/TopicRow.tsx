"use client";

import * as React from "react";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { BookmarkButton } from "@/components/atoms/Bookmark";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { cn } from "@/lib/utils";
import { LOCK_TOOLTIP_MS } from "@/lib/motion/feedback";
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
   * Why a Locked row cannot open, e.g. "Complete Review 2 peer submissions first". Shown in a
   * small tooltip when the learner activates the row (it does not navigate) and announced politely.
   */
  lockedHint?: string;
  onClick?: () => void;
  onToggleBookmark?: () => void;
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
/** The nearest ancestor that scrolls vertically (the sidebar's topic list), if any. */
function scrollBox(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const { overflowY } = window.getComputedStyle(p);
    if (overflowY === "auto" || overflowY === "scroll") return p;
  }
  return null;
}

/**
 * The locked row's tooltip: open on activation, closed on blur, Escape or after 3 s.
 * No shake of the row (motion-matrix §7.6): the hint enters with a fade and a 4px rise.
 * A row in the lower half of its scroll box opens it above, so the list never clips it.
 * The polite announcement is cleared and set again a moment later (short2), so a repeat
 * activation is announced again.
 */
function useLockedHint(text: string | undefined) {
  const [open, setOpen] = React.useState(false);
  const [above, setAbove] = React.useState(false);
  const [shown, setShown] = React.useState(0);
  const [announcement, setAnnouncement] = React.useState("");
  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpen(false), LOCK_TOOLTIP_MS);
    return () => window.clearTimeout(t);
  }, [open, shown]);
  React.useEffect(() => {
    if (!shown || !text) return;
    setAnnouncement("");
    // A short timer, not a frame: frames do not run in a background tab, the region must still speak.
    const t = window.setTimeout(() => setAnnouncement(text), MOTION_MS.short2);
    return () => window.clearTimeout(t);
  }, [shown, text]);
  return {
    open,
    above,
    announcement,
    show: (row: HTMLElement | null) => {
      if (row) {
        const box = scrollBox(row);
        const r = row.getBoundingClientRect();
        const b = box ? box.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
        setAbove((r.top + r.bottom) / 2 > (b.top + b.bottom) / 2);
      }
      setOpen(true);
      setShown((n) => n + 1);
    },
    hide: () => setOpen(false),
  };
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
  lockedHint,
  onClick,
  onToggleBookmark,
  collapsed = false,
  className,
}: TopicRowProps) {
  const locked = status === "Locked";
  const hint = useLockedHint(lockedHint);
  const hintId = React.useId();
  const rowRef = React.useRef<HTMLDivElement>(null);
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
        // A locked topic does not open, here as in the expanded row; trying it announces why
        // (no visual tooltip on the rail: its flyout already shows the topic).
        onClick={locked ? (lockedHint ? (e) => hint.show(e.currentTarget) : undefined) : onClick}
        aria-disabled={locked || undefined}
        aria-describedby={locked && lockedHint ? hintId : undefined}
        aria-current={active ? "page" : undefined}
        // Icon-only rail row: the name carries what the ring and badge show.
        aria-label={`${title}, ${type}, ${STATUS_TEXT[status]}`}
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
      ref={rowRef}
      className={cn(
        "group relative flex items-start gap-2 py-3 pl-3 pr-2 transition-colors",
        active ? "bg-sko-bg-primary-soft" : "hover:bg-sko-bg-subtle",
        className,
      )}
    >
      {active ? <ActiveRule /> : null}
      <button
        type="button"
        onClick={locked ? (lockedHint ? () => hint.show(rowRef.current) : undefined) : onClick}
        onBlur={locked ? hint.hide : undefined}
        onKeyDown={
          locked
            ? (e) => {
                if (e.key === "Escape" && hint.open) {
                  e.stopPropagation();
                  hint.hide();
                }
              }
            : undefined
        }
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
          {/* state-row: brand type badge · gray duration (Caption/Medium), 6px apart,
              on one line; the trailing duration truncates with an ellipsis. */}
          <span className="flex min-w-0 items-center gap-1.5">
            <TopicTypeBadge type={type} className="shrink-0" />
            {/* Duration is optional: render nothing rather than a dash placeholder. */}
            {duration ? (
              <>
                <span className="sk-text-body-medium-medium shrink-0 text-sko-text-subtle" aria-hidden>
                  ·
                </span>
                <span className="sk-text-body-small-medium min-w-0 truncate text-sko-text-subtle">
                  {duration}
                </span>
              </>
            ) : null}
            {optional ? (
              <span className="sk-text-body-small-medium shrink-0 text-sko-icon-faint">Optional</span>
            ) : null}
            <span className="sr-only">, {STATUS_TEXT[status]}</span>
          </span>
        </span>
      </button>
      {lockedA11y}
      {locked && lockedHint && hint.open ? (
        <span
          aria-hidden
          className={cn(
            "sk-animate-rise sk-rise-nudge sk-text-body-small-semibold pointer-events-none absolute left-3 z-20 w-max max-w-[240px] rounded-control bg-sko-bg-inverse px-3 py-2 text-sko-text-on-inverse",
            hint.above ? "bottom-full -mb-1" : "top-full -mt-1",
          )}
        >
          <span
            className={cn(
              "absolute left-3 size-2.5 rotate-45 rounded-inner bg-sko-bg-inverse",
              hint.above ? "-bottom-1" : "-top-1",
            )}
          />
          {lockedHint}
        </span>
      ) : null}
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
