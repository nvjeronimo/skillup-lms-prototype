import * as React from "react";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { cn, isEstimatedDuration } from "@/lib/utils";
import type { TopicType } from "@/lib/types";

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
    <header className={cn("flex flex-col gap-1", className)}>
      {/* One line on every screen (Nelson, 25 Oct 2026): the type and the completion badge keep
          their width, the duration gives way and ends in an ellipsis. */}
      <div className="flex min-w-0 items-center gap-2">
        <TopicTypeBadge type={type} label={typeLabel} className="shrink-0" />
        {/* Duration is optional; with none, render nothing rather than a stray
            "approx." or a dash placeholder. Separator and Duration are two
            body-medium/Medium layers in text/subtle, as in the DS meta-row. */}
        {showDuration && duration ? (
          <span data-invented={durationInvented} className="contents">
            <span aria-hidden className="sk-text-body-medium-medium shrink-0 text-sko-text-subtle">
              ·
            </span>
            <span title={durationLabel} className="sk-text-body-medium-medium min-w-0 truncate text-sko-text-subtle">
              {durationLabel}
            </span>
          </span>
        ) : null}
        {rightSlot ? <div className="ml-auto shrink-0">{rightSlot}</div> : null}
      </div>
      <h1 className="sk-text-headline-small-semibold text-sko-text-default">{title}</h1>
      {showDescription && description ? (
        <p
          data-invented="description: a unit has a display name only in Open edX"
          className="sk-text-body-large-medium text-sko-text-muted"
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
