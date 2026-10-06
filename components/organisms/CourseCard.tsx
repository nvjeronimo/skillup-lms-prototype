import * as React from "react";
import { CourseTypeBadge, DifficultyBadge, DeliveryModeBadge, ProviderBadge, type Difficulty, type DeliveryMode, type Provider } from "@/components/atoms/MetaBadges";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
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
  /** Estimated completion (e.g. "May 24"), shown as "Est. completion: {estimation}" at the right of the progress row. */
  estimation: string;
  initials: string;
  upNext?: { type: TopicType; title: string };
  /** Where Resume goes. With it the action is a real link; `onResume` is the fallback. */
  resumeHref?: string;
  onResume?: () => void;
  className?: string;
}

/**
 * My Learning dashboard row. One per enrolled course.
 *
 * Matches DS `LMS / Course Card` Layout=List (20888:6124) from xl up: thumb,
 * titles, progress and up-next are direct children of one row (padding 16,
 * gap 24). The List layout is 1200 wide in the DS and does not fit narrower
 * containers, so below xl the same blocks stack and the overflow (···)
 * trigger is pinned to the card's top-right corner.
 */
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
  resumeHref,
  onResume,
  className,
}: CourseCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-4 xl:flex-row xl:items-center xl:gap-6",
        className,
      )}
    >
      {/* Stacked: pr-10 keeps the titles clear of the pinned 32px overflow trigger. */}
      <div className="flex min-w-0 flex-1 gap-4 pr-10 xl:gap-6 xl:pr-0">
        {/* DS thumb: bg/primary-soft, Initials text/primary. List 79px (Grid 86px). */}
        <span className="sk-text-display-xs-semibold inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-sko-bg-primary-soft text-sko-text-primary">
          {initials}
        </span>
        {/* DS titles: vertical, gap 2 — Course Type badge, Title, Meta-Row. */}
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <CourseTypeBadge value={courseType} />
          <h2 className="sk-text-md-semibold text-sko-text-default">{title}</h2>
          {/* DS Meta-Row: gap 16 — Provider badge, then badges (gap 8). */}
          <div className="flex flex-wrap items-center gap-4">
            <ProviderBadge value={provider} />
            <div className="flex flex-wrap items-center gap-2">
              <DifficultyBadge value={difficulty} />
              <DeliveryModeBadge value={deliveryMode} />
            </div>
          </div>
        </div>
      </div>

      {/* DS progress: own column, 280 wide in List (gap 6); gap 8 when stacked. */}
      <div className="flex flex-col gap-2 xl:w-[280px] xl:shrink-0 xl:gap-1.5">
        {/* "Est. completion:" rather than the full "Estimated completion:" so the label
            fits the 280px List column; if it still does not, it wraps right-aligned. */}
        <div className="flex items-center justify-between gap-2">
          <span className="sk-text-md-semibold shrink-0 whitespace-nowrap text-sko-text-default">{progressPct}% complete</span>
          <span className="sk-text-sm-regular text-right text-sko-text-subtle">Est. completion: {estimation}</span>
        </div>
        <PlatformProgressBar value={progressPct} label={`${title} progress`} track="muted" />
      </div>

      {upNext ? (
        /* DS up-next: horizontal, centred, padding 8/12, gap 16, radius 8, bg/subtle.
           xl:max-w-[320px] is a guard, no DS value. */
        <div className="flex min-w-0 items-center gap-4 rounded-lg bg-sko-bg-subtle px-3 py-2 xl:max-w-[320px]">
          {/* DS Next-Content: vertical, gap 6 — Overline, Next-Title (1 line), Topic-Types badge. */}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
            <span className="sk-text-2xs-semibold text-sko-text-subtle">Up next</span>
            <span className="sk-text-sm-medium w-full truncate text-sko-text-default">{upNext.title}</span>
            <TopicTypeBadge type={upNext.type} />
          </div>
          {/* DS cta-slot (List): Buttons/Button Size=lg, Hierarchy=Secondary. */}
          {/* Unique name per card (WCAG 2.4.6); the visible "Resume" stays first. */}
          {resumeHref ? (
            <ButtonLink
              href={resumeHref}
              hierarchy="secondary"
              size="lg"
              aria-label={`Resume ${title}`}
              className="shrink-0"
            >
              Resume
            </ButtonLink>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={onResume}
              aria-label={`Resume ${title}`}
              className="shrink-0"
            >
              Resume
            </Button>
          )}
        </div>
      ) : null}

      {/* Stacked: pinned top-right so the menu (right-0) opens under its trigger.
          xl: back in the row as its last item. */}
      <div className="absolute right-4 top-4 xl:static">
        <CardOverflowMenu itemLabel={title} />
      </div>
    </div>
  );
}
