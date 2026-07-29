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
        <div className="flex items-center gap-4 border-t border-sk-border-secondary pt-4">
          <Avatar name={byline.author} size="md" />
          <div className="min-w-0 flex-1">
            <p className="sk-text-sm-semibold text-sk-text-primary">{byline.author}</p>
            <p className="sk-text-sm-regular text-sk-text-secondary">{byline.role}</p>
          </div>
          <span className="sk-text-sm-regular shrink-0 text-sk-text-tertiary">
            Updated {byline.updated}
          </span>
        </div>
      ) : null}

      <ContentFeedback
        className={byline ? "" : "border-t border-sk-border-secondary pt-4"}
        value={feedback}
        onLike={() => setFeedback((f) => (f === "like" ? null : "like"))}
        onDislike={() => setFeedback((f) => (f === "dislike" ? null : "dislike"))}
        onReport={onReport}
      />
    </div>
  );
}
