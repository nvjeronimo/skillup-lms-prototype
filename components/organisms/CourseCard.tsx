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
        <span className="lms-text-lg-semibold inline-flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-lg bg-lms-bg-brand-section text-lms-text-brand-secondary">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <CourseTypeBadge value={courseType} />
            <ProviderBadge value={provider} />
          </div>
          <h3 className="lms-text-md-semibold mt-1 text-lms-text-primary">{title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <DifficultyBadge value={difficulty} />
            <DeliveryModeBadge value={deliveryMode} />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-lms-bg-tertiary">
              <div className="h-full rounded-full bg-lms-fg-progress" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="lms-text-xs-regular text-lms-text-tertiary">
              {progressPct}% · {estimation}
            </span>
          </div>
        </div>
      </div>

      {upNext ? (
        <div className="flex flex-col gap-2 rounded-lg bg-lms-bg-secondary p-3 md:w-64">
          <span className="lms-text-2xs-medium text-lms-text-tertiary">Up next</span>
          <TopicTypeBadge type={upNext.type} />
          <span className="lms-text-sm-medium text-lms-text-primary">{upNext.title}</span>
          <Button variant="primary" size="sm" onClick={onResume}>
            Resume
          </Button>
        </div>
      ) : null}

      <CardOverflowMenu />
    </div>
  );
}
