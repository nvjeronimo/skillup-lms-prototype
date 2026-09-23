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
        "flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-4 md:flex-row md:items-center",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 gap-4">
        <span className="sk-text-display-xs-semibold inline-flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-lg bg-sko-bg-primary text-sko-text-on-primary">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <CourseTypeBadge value={courseType} />
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <h3 className="sk-text-md-semibold text-sko-text-default">{title}</h3>
            <ProviderBadge value={provider} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <DifficultyBadge value={difficulty} />
            <DeliveryModeBadge value={deliveryMode} />
          </div>
          <p className="sk-text-sm-regular mt-2 text-sko-text-subtle">
            {progressPct}% complete · Estimated completion: {estimation}
          </p>
        </div>
      </div>

      {upNext ? (
        <div className="flex flex-col gap-2 rounded-lg bg-sko-bg-subtle p-4 md:w-72">
          <span className="sk-text-2xs-medium text-sko-text-primary">Up next</span>
          <span className="sk-text-sm-medium text-sko-text-default">{upNext.title}</span>
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
