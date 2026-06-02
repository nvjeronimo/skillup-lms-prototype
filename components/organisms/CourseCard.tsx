import * as React from "react";
import { CourseTypeBadge, DifficultyBadge, DeliveryModeBadge, ProviderBadge, type Difficulty, type DeliveryMode, type Provider } from "@/components/atoms/MetaBadges";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { Button } from "@/components/atoms/Button";
import { CardOverflowMenu } from "@/components/molecules/CardOverflowMenu";
import { cn } from "@/lib/utils";
import type { TopicType } from "@/lib/types";

export interface CourseCardProps {
  title: string;
  provider: Provider;
  courseType: "Program" | "Course";
  difficulty: Difficulty;
  deliveryMode: DeliveryMode;
  progressPct: number;
  estimation: string;
  initials: string;
  upNext?: { type: TopicType; title: string };
  onResume?: () => void;
  className?: string;
}

/** My Learning dashboard row. One per enrolled course. */
export function CourseCard({
  title,
  provider,
  courseType,
  difficulty,
  deliveryMode,
  progressPct,
  estimation,
  initials,
  upNext,
  onResume,
  className,
}: CourseCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-lms-border-secondary bg-lms-bg-primary p-4 md:flex-row md:items-center",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 gap-4">
        <span className="lms-text-display-xs-semibold inline-flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-lg bg-lms-bg-brand-solid text-lms-text-primary-on-brand">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <CourseTypeBadge value={courseType} />
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <h3 className="lms-text-md-semibold text-lms-text-primary">{title}</h3>
            <ProviderBadge value={provider} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <DifficultyBadge value={difficulty} />
            <DeliveryModeBadge value={deliveryMode} />
          </div>
          <p className="lms-text-sm-regular mt-2 text-lms-text-tertiary">
            {progressPct}% complete · Estimated completion: {estimation}
          </p>
        </div>
      </div>

      {upNext ? (
        <div className="flex flex-col gap-2 rounded-lg bg-lms-bg-secondary p-4 md:w-72">
          <span className="lms-text-2xs-medium text-lms-text-brand-secondary">Up next</span>
          <span className="lms-text-sm-medium text-lms-text-primary">{upNext.title}</span>
          <TopicTypeBadge type={upNext.type} />
          <Button variant="primary" size="sm" onClick={onResume} className="mt-1 self-start">
            Resume
          </Button>
        </div>
      ) : null}

      <CardOverflowMenu />
    </div>
  );
}
