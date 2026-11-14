import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { ContentFeedback } from "@/components/molecules/ContentFeedback";
import type { TopicByline } from "@/lib/content";
import { cn } from "@/lib/utils";
import styles from "./TopicFooterMeta.module.css";

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
    <div className={styles.footer}>
      {byline ? (
        // DS `LMS / Topic · Author & Updated Date`: the row bottom-aligns the date (gap 16);
        // the Author frame is avatar md + text column (gap 12); name over role (gap 2). On a phone
        // the date wraps under the author, 12 below (Figma 5685:171926; Nelson's SKO match review,
        // 28 Oct 2026): beside it, it squeezed the name to 2 lines and the role to 4.
        <div
          data-invented="byline: Open edX shows no author or updated date for a unit"
          className={styles.byline}
        >
          <div className={styles.author}>
            <Avatar name={byline.author} size="md" />
            <div className={styles.authorText}>
              <p className={`sk-text-body-large-semibold ${styles.name}`}>{byline.author}</p>
              <p className={`sk-text-body-medium-regular ${styles.role}`}>{byline.role}</p>
            </div>
          </div>
          <span className={`sk-text-body-small-regular ${styles.updated}`}>
            Updated {byline.updated}
          </span>
        </div>
      ) : null}

      {/* DS `Content-Feedback` and the Figma `Feedback-Mark` row: a rule above and below, 12 of
          padding (the component's own py-3), and 12 between the byline and the rule. The rules
          stay when the action goes (topic completed), so the row does not jump. */}
      <ContentFeedback
        className={cn(styles.feedback, byline && styles.feedbackAfterByline)}
        action={action}
        value={feedback}
        onLike={() => setFeedback((f) => (f === "like" ? null : "like"))}
        onDislike={() => setFeedback((f) => (f === "dislike" ? null : "dislike"))}
        onReport={onReport}
      />
    </div>
  );
}
