import * as React from "react";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { cn, isEstimatedDuration } from "@/lib/utils";
import type { TopicType } from "@/lib/types";

export interface TopicHeaderProps {
  type: TopicType;
  title: string;
  duration: string;
  description?: string;
  showDescription?: boolean;
  showDuration?: boolean;
  /** Right-aligned content on the meta row (e.g. the completion action/badge). */
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * Content header above the player body. meta-row (badge · duration) + Title +
 * Description. The "approx." prefix is added for estimated topic types only —
 * never for Video/Recording/Live/timed Quiz.
 */
export function TopicHeader({
  type,
  title,
  duration,
  description,
  showDescription = true,
  showDuration = true,
  rightSlot,
  className,
}: TopicHeaderProps) {
  // If source data already carries "approx.", trust it; otherwise derive.
  const needsApprox = isEstimatedDuration(type) && !/approx\./i.test(duration);
  const durationLabel = needsApprox ? `approx. ${duration}` : duration;

  return (
    // DS: root, Content Container and meta-row → title are 4px apart; meta-row items 8px.
    <header className={cn("flex flex-col gap-1", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <TopicTypeBadge type={type} />
        {/* Duration is optional; with none, render nothing rather than a stray
            "approx." or a dash placeholder. Separator and Duration are two
            body-medium/Medium layers in text/subtle, as in the DS meta-row. */}
        {showDuration && duration ? (
          <>
            <span aria-hidden className="sk-text-sm-medium text-sko-text-subtle">
              ·
            </span>
            <span className="sk-text-sm-medium text-sko-text-subtle">{durationLabel}</span>
          </>
        ) : null}
        {rightSlot ? <div className="ml-auto shrink-0">{rightSlot}</div> : null}
      </div>
      <h1 className="sk-text-display-xs-semibold text-sko-text-default">{title}</h1>
      {showDescription && description ? (
        <p className="sk-text-md-medium text-sko-text-muted">{description}</p>
      ) : null}
    </header>
  );
}
