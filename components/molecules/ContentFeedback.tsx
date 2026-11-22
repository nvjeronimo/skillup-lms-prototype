import * as React from "react";
import { AlertTriangle, ThumbsDown, ThumbsUp } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ReportIssueModal, type ReportIssuePayload } from "@/components/organisms/ReportIssueModal";
import { cn } from "@/lib/utils";
import styles from "./ContentFeedback.module.css";

export interface ContentFeedbackProps {
  value?: "like" | "dislike" | null;
  onLike?: () => void;
  onDislike?: () => void;
  /** Called when a report is submitted from the modal. */
  onReport?: (payload: ReportIssuePayload) => void;
  /**
   * DS `Show License Text`: the content licence (e.g. "CC BY-SA 4.0") in body-small/Medium
   * text/primary, right after "Report an issue" (Content-Feedback v1.1, 13 Oct 2026; also when
   * the row has no action, Nelson's SKO match review, 28 Oct 2026). Omitted → no licence.
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
 * the bottom of content blocks, the optional licence following the feedback items.
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
  const btn = `sk-text-body-small-medium ${styles.item}`;
  const glyph = { size: 16, strokeWidth: 1.5, absoluteStrokeWidth: true } as const;
  const licence = license ? (
    <a href={licenseHref} className={`sk-text-body-small-medium ${styles.licence}`}>
      {license}
    </a>
  ) : null;
  return (
    <div
      className={cn(styles.row, action && styles.withAction, className)}
    >
      <div className={styles.items}>
        <button
          type="button"
          onClick={onLike}
          aria-pressed={liked}
          className={cn(btn, liked ? styles.liked : styles.muted)}
        >
          <Icon
            icon={ThumbsUp}
            {...glyph}
            fill={liked ? "currentColor" : "none"}
            className={liked ? undefined : styles.glyph}
          />
          Like
        </button>
        <button
          type="button"
          onClick={onDislike}
          aria-pressed={disliked}
          className={cn(btn, disliked ? styles.disliked : styles.muted)}
        >
          <Icon
            icon={ThumbsDown}
            {...glyph}
            fill={disliked ? "currentColor" : "none"}
            className={disliked ? undefined : styles.glyph}
          />
          Dislike
        </button>
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          data-invented="report: nothing in Open edX receives a per-unit content report"
          className={cn(btn, styles.report)}
        >
          <Icon
            icon={AlertTriangle}
            {...glyph}
            className={styles.reportGlyph}
          />
          Report an issue
        </button>
        {licence}
      </div>

      {action ? <div className={styles.action}>{action}</div> : null}

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
