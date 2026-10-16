"use client";

import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { ContentFeedback } from "@/components/molecules/ContentFeedback";
import type { TopicByline } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface TopicFooterMetaProps {
  /** Author & Updated Date row — present only on authored content types. */
  byline?: TopicByline;
  onReport?: () => void;
  /** The end-of-content action (Mark as Complete): it sits in the feedback row, on the right. */
  action?: React.ReactNode;
}

/**
 * Shared topic footer-meta (topic-types-inventory §175). The feedback row
 * (Like/Dislike/Report) renders on every type; the Author & Updated Date row is
 * gated by the caller to authored content types only. The license lives in the
 * video chrome footer for now — deliberately not shown here (pending edX docs).
 */
export function TopicFooterMeta({ byline, onReport, action }: TopicFooterMetaProps) {
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);

  return (
    <div className="mt-6 flex flex-col">
      {byline ? (
        // DS `LMS / Topic · Author & Updated Date`: the row bottom-aligns the date (gap 16);
        // the Author frame is avatar md + text column (gap 12); name over role (gap 2).
        <div className="flex items-end gap-4 border-t border-sko-border-subtle pt-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar name={byline.author} size="md" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="sk-text-body-large-semibold text-sko-text-default">{byline.author}</p>
              <p className="sk-text-body-medium-regular text-sko-text-muted">{byline.role}</p>
            </div>
          </div>
          <span className="sk-text-body-small-regular shrink-0 text-sko-text-muted">
            Updated {byline.updated}
          </span>
        </div>
      ) : null}

      {/* DS `Content-Feedback` and the Figma `Feedback-Mark` row: a rule above and below, 12 of
          padding (the component's own py-3), and 12 between the byline and the rule. The rules
          stay when the action goes (topic completed), so the row does not jump. */}
      <ContentFeedback
        className={cn("border-y border-sko-border-subtle", byline && "mt-3")}
        action={action}
        value={feedback}
        onLike={() => setFeedback((f) => (f === "like" ? null : "like"))}
        onDislike={() => setFeedback((f) => (f === "dislike" ? null : "dislike"))}
        onReport={onReport}
      />
    </div>
  );
}
