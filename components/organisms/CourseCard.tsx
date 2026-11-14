import * as React from "react";
import { CourseTypeBadge, DifficultyBadge, DeliveryModeBadge, ProviderBadge, type Difficulty, type DeliveryMode, type Provider } from "@/components/atoms/MetaBadges";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CardOverflowMenu } from "@/components/molecules/CardOverflowMenu";
import { cn } from "@/lib/utils";
import type { TopicType } from "@/lib/types";
import styles from "./CourseCard.module.css";

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
        styles.card,
        className,
      )}
    >
      {/* Stacked: pr-10 keeps the titles clear of the pinned 32px overflow trigger. */}
      <div className={styles.head}>
        {/* DS thumb: bg/primary-soft, Initials text/primary. List 79px (Grid 86px). */}
        <span className={`sk-text-headline-small-semibold ${styles.thumb}`}>
          {initials}
        </span>
        {/* DS titles: vertical, gap 2 — Course Type badge, Title, Meta-Row. */}
        <div className={styles.titles}>
          <CourseTypeBadge value={courseType} />
          <h2 className={`sk-text-body-large-semibold ${styles.title}`}>{title}</h2>
          {/* DS Meta-Row: gap 16 — Provider badge, then badges (gap 8). */}
          <div className={styles.metaRow}>
            <ProviderBadge value={provider} />
            <div className={styles.badges}>
              <DifficultyBadge value={difficulty} />
              <DeliveryModeBadge value={deliveryMode} />
            </div>
          </div>
        </div>
      </div>

      {/* DS progress: own column, 280 wide in List (gap 6); gap 8 when stacked. */}
      <div className={styles.progress}>
        {/* "Est. completion:" rather than the full "Estimated completion:" so the label
            fits the 280px List column; if it still does not, it wraps right-aligned. */}
        <div className={styles.progressRow}>
          <span className={`sk-text-body-large-semibold ${styles.percent}`}>{progressPct}% complete</span>
          <span className={`sk-text-body-medium-regular ${styles.estimation}`}>Est. completion: {estimation}</span>
        </div>
        <PlatformProgressBar value={progressPct} label={`${title} progress`} track="muted" />
      </div>

      {upNext ? (
        /* DS up-next: horizontal, centred, padding 8/12, gap 16, radius 8, bg/subtle.
           xl:max-w-[320px] is a guard, no DS value. */
        <div className={styles.upNext}>
          {/* DS Next-Content: vertical, gap 6 — Overline, Next-Title (1 line), Topic-Types badge. */}
          <div className={styles.upNextContent}>
            <span className={`sk-text-label-small-semibold ${styles.upNextLabel}`}>Up next</span>
            <span className={`sk-text-body-medium-medium ${styles.upNextTitle}`}>{upNext.title}</span>
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
              className={styles.resume}
            >
              Resume
            </ButtonLink>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={onResume}
              aria-label={`Resume ${title}`}
              className={styles.resume}
            >
              Resume
            </Button>
          )}
        </div>
      ) : null}

      {/* Stacked: pinned top-right so the menu (right-0) opens under its trigger.
          xl: back in the row as its last item. */}
      <div className={styles.menu}>
        <CardOverflowMenu itemLabel={title} />
      </div>
    </div>
  );
}
