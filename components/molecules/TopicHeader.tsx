import * as React from "react";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { cn, isEstimatedDuration } from "@/lib/utils";
import type { TopicType } from "@/lib/types";
import styles from "./TopicHeader.module.css";

export interface TopicHeaderProps {
  type: TopicType;
  /** The badge's label when it is not the type's own (a quiz's assignment type). */
  typeLabel?: string;
  title: string;
  duration: string;
  description?: string;
  showDescription?: boolean;
  showDuration?: boolean;
  /** When set, the duration is ours, not Open edX's: tagged data-invented with this reason. */
  durationInvented?: string;
  /** Right-aligned content on the meta row (e.g. the completion action/badge). */
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * Content header above the player body. meta-row (badge · duration) + Title +
 * Description. The "approx." marker is added (at the end, Nelson 14 Oct 2026: "8 min read approx.") for estimated topic types only —
 * never for Video/Recording/Live/timed Quiz.
 */
export function TopicHeader({
  type,
  typeLabel,
  title,
  duration,
  description,
  showDescription = true,
  showDuration = true,
  durationInvented,
  rightSlot,
  className,
}: TopicHeaderProps) {
  // If source data already carries "approx.", trust it; otherwise derive.
  const needsApprox = isEstimatedDuration(type) && !/approx\./i.test(duration);
  const durationLabel = needsApprox ? `${duration} approx.` : duration;

  return (
    // DS: root, Content Container and meta-row → title are 4px apart; meta-row items 8px.
    <header className={cn(styles.header, className)}>
      {/* One line on every screen (Nelson, 25 Oct 2026): the type and the completion badge keep
          their width, the duration gives way and ends in an ellipsis. */}
      <div className={styles.meta}>
        <TopicTypeBadge type={type} label={typeLabel} className={styles.badge} />
        {/* Duration is optional; with none, render nothing rather than a stray
            "approx." or a dash placeholder. Separator and Duration are two
            body-medium/Medium layers in text/subtle, as in the DS meta-row. */}
        {showDuration && duration ? (
          <span data-invented={durationInvented} className={styles.durationGroup}>
            <span aria-hidden className={`sk-text-body-medium-medium ${styles.separator}`}>
              ·
            </span>
            <span title={durationLabel} className={`sk-text-body-medium-medium ${styles.duration}`}>
              {durationLabel}
            </span>
          </span>
        ) : null}
        {rightSlot ? <div className={styles.right}>{rightSlot}</div> : null}
      </div>
      <h1 className={`sk-text-headline-small-semibold ${styles.title}`}>{title}</h1>
      {showDescription && description ? (
        <p
          data-invented="description: a unit has a display name only in Open edX"
          className={`sk-text-body-large-medium ${styles.description}`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
