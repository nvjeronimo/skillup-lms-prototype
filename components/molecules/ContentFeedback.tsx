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
  className?: string;
}

/**
 * DS `LMS / Content Feedback` (node 19975-537661): like / dislike / report row at
 * the bottom of content blocks, with the optional licence at the right end.
 * Row: space-between, padding 12 top/bottom. Items: gap 16, no padding; each item
 * is a 16px icon/faint glyph (stroke 1.5) + a body-small/Medium label, gap 8.
 */
export function ContentFeedback({
  value = null,
  onLike,
  onDislike,
  onReport,
  license,
  licenseHref = "#",
  className,
}: ContentFeedbackProps) {
  const [reportOpen, setReportOpen] = React.useState(false);
  const liked = value === "like";
  const disliked = value === "dislike";
  const btn = "sk-text-xs-medium inline-flex items-center gap-2 transition-colors";
  const glyph = { size: 16, strokeWidth: 1.5, absoluteStrokeWidth: true } as const;
  return (
    <div className={cn("flex items-center justify-between gap-4 py-3", className)}>
      <div className="flex items-center gap-4">
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
            className="text-sko-icon-faint group-hover:text-sko-icon-warning"
          />
          Report an issue
        </button>
      </div>

      {license ? (
        <a href={licenseHref} className="sk-text-xs-medium shrink-0 text-sko-text-primary">
          {license}
        </a>
      ) : null}

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
