"use client";

import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { ContentFeedback } from "@/components/molecules/ContentFeedback";
import type { TopicByline } from "@/lib/content";

export interface TopicFooterMetaProps {
  /** Author & Updated Date row — present only on authored content types. */
  byline?: TopicByline;
  onReport?: () => void;
}

/**
 * Shared topic footer-meta (topic-types-inventory §175). The feedback row
 * (Like/Dislike/Report) renders on every type; the Author & Updated Date row is
 * gated by the caller to authored content types only. The license lives in the
 * video chrome footer for now — deliberately not shown here (pending edX docs).
 */
export function TopicFooterMeta({ byline, onReport }: TopicFooterMetaProps) {
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);

  return (
    <div className="mt-6 flex flex-col gap-3">
      {byline ? (
        // DS `LMS / Topic · Author & Updated Date`: the row bottom-aligns the date (gap 16);
        // the Author frame is avatar md + text column (gap 12); name over role (gap 2).
        <div className="flex items-end gap-4 border-t border-sko-border-subtle pt-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar name={byline.author} size="md" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="sk-text-md-semibold text-sko-text-default">{byline.author}</p>
              <p className="sk-text-sm-regular text-sko-text-muted">{byline.role}</p>
            </div>
          </div>
          <span className="sk-text-xs-regular shrink-0 text-sko-text-muted">
            Updated {byline.updated}
          </span>
        </div>
      ) : null}

      <ContentFeedback
        className={byline ? "" : "border-t border-sko-border-subtle pt-4"}
        value={feedback}
        onLike={() => setFeedback((f) => (f === "like" ? null : "like"))}
        onDislike={() => setFeedback((f) => (f === "dislike" ? null : "dislike"))}
        onReport={onReport}
      />
    </div>
  );
}
