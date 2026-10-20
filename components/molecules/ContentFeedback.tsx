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
  /**
   * DS `Show License Text`: the content licence (e.g. "CC BY-SA 4.0"), shown
   * right-aligned in body-small/Medium text/primary. Omitted → no licence.
   */
  license?: string;
  /** Where the licence text links to. */
  licenseHref?: string;
  /**
   * The topic's end-of-content action: Mark as Complete (Figma `Feedback-Mark`, 13 Oct 2026).
   * It sits in this row, at the right end, and the licence then follows the feedback items on
   * the left. When the row is too narrow (a phone) the action drops under the feedback.
   */
  action?: React.ReactNode;
  className?: string;
}

/**
 * DS `LMS / Content Feedback` (node 19975-537661): like / dislike / report row at
 * the bottom of content blocks, with the optional licence at the right end.
 * Row: space-between, padding 12 top/bottom. Items: gap 16, no padding; each item
 * is a 16px icon/faint glyph (stroke 1.5) + a body-small/Medium label, gap 8.
 *
 * With `action` it is the Figma `Feedback-Mark` row: a rule above and below, feedback (and
 * licence) on the left, the action on the right; wrapped, the rows are 16 apart on a phone
 * and 24 above it.
 */
export function ContentFeedback({
  value = null,
  onLike,
  onDislike,
  onReport,
  license,
  licenseHref = "#",
  action,
  className,
}: ContentFeedbackProps) {
  const [reportOpen, setReportOpen] = React.useState(false);
  const liked = value === "like";
  const disliked = value === "dislike";
  // Hover pad: px-2/py-1 cancelled by -mx-2/-my-1, so the DS geometry (no item padding,
  // gap 16 = 2 × 8) is unchanged while the hover fill and hit area come back (18 + 8 = 26px tall).
  const btn =
    "sk-text-body-small-medium -mx-2 -my-1 inline-flex items-center gap-2 rounded-control px-2 py-1 transition-colors hover:bg-sko-bg-subtle";
  const glyph = { size: 16, strokeWidth: 1.5, absoluteStrokeWidth: true } as const;
  const licence = license ? (
    <a href={licenseHref} className="sk-text-body-small-medium shrink-0 text-sko-text-primary">
      {license}
    </a>
  ) : null;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between py-3",
        action ? "gap-x-4 gap-y-4 border-y border-sko-border-subtle sm:gap-y-6" : "gap-4",
        className,
      )}
    >
      <div className={cn("flex items-center gap-4", action && "flex-wrap")}>
        <button
          type="button"
          onClick={onLike}
          aria-pressed={liked}
          className={cn(btn, liked ? "text-sko-icon-info" : "text-sko-text-muted")}
        >
          <Icon
            icon={ThumbsUp}
            {...glyph}
            fill={liked ? "currentColor" : "none"}
            className={liked ? undefined : "text-sko-icon-faint"}
          />
          Like
        </button>
        <button
          type="button"
          onClick={onDislike}
          aria-pressed={disliked}
          className={cn(btn, disliked ? "text-sko-text-error" : "text-sko-text-muted")}
        >
          <Icon
            icon={ThumbsDown}
            {...glyph}
            fill={disliked ? "currentColor" : "none"}
            className={disliked ? undefined : "text-sko-icon-faint"}
          />
          Dislike
        </button>
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className={cn(btn, "group text-sko-text-subtle hover:text-sko-text-warning")}
        >
          <Icon
            icon={AlertTriangle}
            {...glyph}
            className="text-sko-icon-faint transition-colors group-hover:text-sko-icon-warning"
          />
          Report an issue
        </button>
        {action ? licence : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : licence}

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
