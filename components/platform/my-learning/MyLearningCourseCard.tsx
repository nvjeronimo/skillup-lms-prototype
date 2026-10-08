import { Clock } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { MyLearningCourse } from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";

export interface MyLearningCourseCardProps {
  course: MyLearningCourse;
  /** DS `Layout`: Grid is the browsing card, List the scan row (desktop only). */
  layout: "grid" | "list";
  /** Weight of the Grid action. In a collection only the first card is `primary`. Defaults to the DS look. */
  emphasis?: "primary" | "secondary";
  className?: string;
}

/* The instance can carry a label that is not the variant's own ("Flexible + Live Sessions"
   on the clock variant). It is rendered as drawn: Badge v2 Soft sm Info with the clock. */
function Delivery({ course }: { course: MyLearningCourse }) {
  return course.deliveryLabel ? (
    <Badge color="info" leftIcon={Clock}>
      {course.deliveryLabel}
    </Badge>
  ) : (
    <DeliveryModeBadge value={course.delivery} />
  );
}

/* DS thumb: bg/primary-soft, radius 10, Initials in text/primary, title-large/Bold. */
function Thumb({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "sk-text-title-large-bold inline-flex shrink-0 items-center justify-center rounded-[10px] bg-sko-bg-primary-soft text-sko-text-primary",
        className,
      )}
    >
      {initials}
    </span>
  );
}

/* DS progress: "{n}% complete" or "Not started" + the meta on the right, then the 8px bar
   (bg/muted track, bg/info fill, both fully rounded). */
function Progress({ course, className }: { course: MyLearningCourse; className?: string }) {
  const pct = course.progressPct ?? 0;
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="sk-text-body-large-semibold whitespace-nowrap text-sko-text-default">
          {course.progressPct === null ? "Not started" : `${course.progressPct}% complete`}
        </span>
        <span className="sk-text-body-medium-regular whitespace-nowrap text-sko-text-subtle">{course.progressMeta}</span>
      </div>
      <PlatformProgressBar track="muted" value={pct} label={`${course.title} progress`} />
    </div>
  );
}

/**
 * DS `LMS / Course Card` (6375:15009) as used on My Learning: Layout=Grid (6375:27427) and
 * Layout=List (6375:26697). White card, 1px border/subtle, radius 12, Shadows/shadow-card.
 *
 * Grid: padding 24, gap 16 — header (thumb 86 + Course Type badge, title, provider), the
 * Difficulty and Delivery badges, progress (gap 8), the one-line up-next strip and a primary
 * Buttons/Button lg.
 * List: one row, padding 16, gap 24 — thumb 120, titles with the Meta-Row (provider, gap 16,
 * badges), progress 280 wide (gap 6), then the up-next block (overline, title, topic type)
 * with a secondary Buttons/Button lg inside it.
 * The action opens the course, so it is a link with the button look (atoms/ButtonLink).
 *
 * The older `organisms/CourseCard` is the previous List layout (overflow menu, "Est.
 * completion", 80px thumb) and is still used by the course hub, so this card is built
 * beside it from the same atoms instead of changing that one.
 *
 * Text without a DS style in the component, mapped to the nearest class: title (SemiBold
 * 20) → title-medium/Semibold; "UP NEXT" (SemiBold 11, +0.6) → label-small/Semibold; the
 * next title (Medium 15) → body-medium/Medium; the meta (Regular 14) → body-medium/Regular.
 */
export function MyLearningCourseCard({ course, layout, emphasis = "primary", className }: MyLearningCourseCardProps) {
  const surface = "rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card";
  // Unique name per card (WCAG 2.4.6); the visible label stays first.
  const actionLabel = `${course.cta} ${course.title}`;

  if (layout === "list") {
    return (
      // The DS stroke is inside the card and the CSS border is outside the padding: 15 + 1 = the DS 16.
      <article className={cn(surface, "flex items-center gap-6 p-[15px]", className)}>
        <Thumb initials={course.initials} className="size-[120px]" />
        <div className="flex min-w-[200px] flex-1 flex-col items-start gap-0.5">
          <CourseTypeBadge value="Course" />
          <h3 className="sk-text-title-large-semibold text-sko-text-default">{course.title}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <ProviderBadge value={course.provider} />
            <div className="flex items-start gap-2">
              <DifficultyBadge value={course.difficulty} />
              <Delivery course={course} />
            </div>
          </div>
        </div>
        <Progress course={course} className="w-[280px] min-w-[180px] shrink gap-1.5" />
        <div className="flex min-w-0 shrink-0 items-center gap-4 rounded-lg bg-sko-bg-subtle px-3 py-2">
          <div className="flex min-w-0 flex-col items-start gap-1.5">
            <span className="sk-text-label-small-semibold text-sko-text-subtle">Up next</span>
            <span className="sk-text-body-medium-medium max-w-[240px] truncate text-sko-text-default">
              {course.upNext.title}
            </span>
            <TopicTypeBadge type={course.upNext.type} />
          </div>
          <ButtonLink href={course.href} hierarchy="secondary" size="lg" aria-label={actionLabel} className="shrink-0">
            {course.cta}
          </ButtonLink>
        </div>
      </article>
    );
  }

  return (
    // Padding is the DS Spacing/3xl: 16 on mobile, 20 on tablet, 24 on desktop. In the DS
    // grid card the 1px stroke takes part in the layout, so the border adds to the padding.
    <article className={cn(surface, "flex flex-col items-start gap-4 p-4 md:p-5 lg:p-6", className)}>
      <div className="flex w-full items-start gap-4">
        <Thumb initials={course.initials} className="size-[86px]" />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <CourseTypeBadge value="Course" />
          <h3 className="sk-text-title-large-semibold text-sko-text-default">{course.title}</h3>
          <ProviderBadge value={course.provider} />
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-2">
        <DifficultyBadge value={course.difficulty} />
        <Delivery course={course} />
      </div>
      <Progress course={course} className="w-full gap-2" />
      <div className="flex w-full items-center justify-between gap-2 rounded-lg bg-sko-bg-subtle px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="sk-text-label-small-semibold shrink-0 text-sko-text-subtle">Up next</span>
          <span className="sk-text-body-medium-medium min-w-0 flex-1 truncate text-sko-text-default">
            {course.upNext.title}
          </span>
        </div>
        <TopicTypeBadge type={course.upNext.type} className="shrink-0" />
      </div>
      {/* mt-auto: in a row of cards with titles of different length, the action stays at the bottom. */}
      <ButtonLink href={course.href} hierarchy={emphasis} size="lg" aria-label={actionLabel} className="mt-auto">
        {course.cta}
      </ButtonLink>
    </article>
  );
}
