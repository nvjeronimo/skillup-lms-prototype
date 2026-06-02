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
  className,
}: TopicHeaderProps) {
  // If source data already carries "approx.", trust it; otherwise derive.
  const needsApprox = isEstimatedDuration(type) && !/approx\./i.test(duration);
  const durationLabel = needsApprox ? `approx. ${duration}` : duration;

  return (
    <header className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        <TopicTypeBadge type={type} />
        {showDuration ? (
          <span className="lms-text-xs-regular text-lms-text-tertiary">· {durationLabel}</span>
        ) : null}
      </div>
      <h1 className="lms-text-display-xs-semibold text-lms-text-primary">{title}</h1>
      {showDescription && description ? (
        <p className="lms-text-md-medium text-lms-text-secondary">{description}</p>
      ) : null}
    </header>
  );
}
