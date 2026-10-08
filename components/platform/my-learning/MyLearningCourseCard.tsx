import Link from "next/link";
import { Button, type ButtonHierarchy } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { MyLearningCourse } from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";
import { CourseThumb } from "./CourseThumb";

export interface MyLearningCourseCardProps {
  course: MyLearningCourse;
  /** DS `Layout`: Grid is the browsing card, List the scan row (desktop only). */
  layout: "grid" | "list";
  /** Weight of the Grid action. In a collection only the first card is `primary`. Defaults to the DS look. */
  emphasis?: "primary" | "secondary";
  /**
   * `card` (My Learning): the card draws its own border, radius and shadow.
   * `row` (the Program page's `Course-Row`): the row's container draws them and the card is
   * bare; in List the thumbnail is pinned at 86 and the up-next block fills the width left;
   * in Grid the action fills the width.
   */
  context?: "card" | "row";
  /** Called by the action of a course without a page (`course.href` unset). */
  onAction?: () => void;
  className?: string;
}

const OVERLINE = "sk-text-label-small-semibold text-sko-text-subtle";

/* DS progress: "{n}% complete", "Complete" or "Not started" + the effort on the right, then
   the 8px bar (bg/muted track, bg/info fill, both fully rounded). */
function Progress({ course, className }: { course: MyLearningCourse; className?: string }) {
  const pct = course.progressPct ?? 0;
  const label = course.progressPct === null ? "Not started" : pct >= 100 ? "Complete" : `${pct}% complete`;
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="sk-text-body-large-semibold whitespace-nowrap text-sko-text-default">{label}</span>
        <span className="sk-text-body-medium-regular whitespace-nowrap text-sko-text-subtle">{course.progressMeta}</span>
      </div>
      <PlatformProgressBar track="muted" value={pct} label={`${course.title} progress`} />
    </div>
  );
}

/* The title opens the course's Course Detail page when it has one; it looks as drawn until hovered. */
function CourseTitle({ course }: { course: MyLearningCourse }) {
  return course.detailHref ? (
    <Link href={course.detailHref} className="hover:underline">
      {course.title}
    </Link>
  ) : (
    <>{course.title}</>
  );
}

/* The action opens the course: a link with the button look when the course has a page, a button otherwise. */
function Action({
  course,
  hierarchy,
  label,
  onAction,
  className,
}: {
  course: MyLearningCourse;
  hierarchy: ButtonHierarchy;
  label: string;
  onAction?: () => void;
  className?: string;
}) {
  return course.href ? (
    <ButtonLink href={course.href} hierarchy={hierarchy} size="lg" aria-label={label} className={className}>
      {course.cta}
    </ButtonLink>
  ) : (
    <Button hierarchy={hierarchy} size="lg" aria-label={label} onClick={onAction} className={className}>
      {course.cta}
    </Button>
  );
}

/**
 * DS `LMS / Course Card` as used on My Learning and inside the Program page's course rows:
 * Layout=Grid and Layout=List. bg/page, 1px border/subtle, radius 12, Shadows/shadow-card.
 * The DS stroke takes part in the layout, so the CSS border adds to the padding.
 *
 * Grid: padding 24 / 20 / 16 (desktop / tablet / mobile), gap 16: header (thumb 86 + Course
 * Type badge, title, provider), the Difficulty and Delivery badges, progress (gap 8), the
 * one-line up-next strip and a Buttons/Button lg.
 * List: one row, padding 16, gap 24: thumb 118, titles with the Meta-Row (provider, gap 16,
 * badges), progress 280 wide (gap 6), then the up-next block (overline, title, topic type)
 * with a secondary Buttons/Button lg inside it.
 * A complete course reads "Complete" over a full bar, and its strip carries the certificate
 * line ("CERTIFICATE · Issued …") instead of the next unit; the action is Review.
 * The thumbnail shows the course image over the initials (DS `Show image`).
 * The action opens the course, so it is a link with the button look (atoms/ButtonLink).
 *
 * The older `organisms/CourseCard` is the previous List layout (overflow menu, "Est.
 * completion", 80px thumb) and is still used by the course hub, so this card is built
 * beside it from the same atoms instead of changing that one.
 *
 * Text without a DS style in the component, mapped to the nearest class: "UP NEXT"
 * (SemiBold 11, +0.6) → label-small/Semibold.
 */
export function MyLearningCourseCard({
  course,
  layout,
  emphasis = "primary",
  context = "card",
  onAction,
  className,
}: MyLearningCourseCardProps) {
  const inRow = context === "row";
  const surface = inRow ? "" : "rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card";
  // Unique name per card (WCAG 2.4.6); the visible label stays first.
  const actionLabel = `${course.cta} ${course.title}`;
  const next = "certificate" in course.upNext ? null : course.upNext;
  const overline = next ? "Up next" : "Certificate";
  const nextTitle = "certificate" in course.upNext ? course.upNext.certificate : course.upNext.title;

  if (layout === "list") {
    return (
      <article className={cn(surface, "flex items-center gap-6 p-4", className)}>
        <CourseThumb
          initials={course.initials}
          imageSrc={course.imageSrc}
          className={inRow ? "size-[86px]" : "size-[118px]"}
        />
        <div className={cn("flex flex-col items-start gap-0.5", inRow ? "min-w-0 flex-1 basis-0" : "min-w-[200px] flex-1")}>
          <CourseTypeBadge value="Course" />
          <h3 className="sk-text-title-large-semibold text-sko-text-default">
            <CourseTitle course={course} />
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <ProviderBadge value={course.provider} />
            <div className="flex items-start gap-2">
              <DifficultyBadge value={course.difficulty} />
              <DeliveryModeBadge value={course.delivery} />
            </div>
          </div>
        </div>
        <Progress course={course} className="w-[280px] min-w-[180px] shrink gap-1.5" />
        <div
          className={cn(
            "flex min-w-0 items-center gap-4 rounded-lg bg-sko-bg-subtle px-3 py-2",
            inRow ? "flex-1 basis-0" : "shrink-0",
          )}
        >
          <div className={cn("flex min-w-0 flex-col items-start gap-1.5", inRow && "flex-1")}>
            <span className={OVERLINE}>{overline}</span>
            <span
              className={cn(
                "sk-text-body-medium-medium text-sko-text-default",
                // My Learning: one line, cut at 240. In a course row the block has the width and the title wraps.
                !inRow && "max-w-[240px] truncate",
              )}
            >
              {nextTitle}
            </span>
            {next ? <TopicTypeBadge type={next.type} /> : null}
          </div>
          <Action course={course} hierarchy="secondary" label={actionLabel} onAction={onAction} className="shrink-0" />
        </div>
      </article>
    );
  }

  return (
    <article className={cn(surface, "flex flex-col items-start gap-4 p-4 md:p-5 lg:p-6", className)}>
      <div className="flex w-full items-start gap-4">
        <CourseThumb initials={course.initials} imageSrc={course.imageSrc} className="size-[86px]" />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <CourseTypeBadge value="Course" />
          <h3 className="sk-text-title-large-semibold text-sko-text-default">
            <CourseTitle course={course} />
          </h3>
          <ProviderBadge value={course.provider} />
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-2">
        <DifficultyBadge value={course.difficulty} />
        <DeliveryModeBadge value={course.delivery} />
      </div>
      <Progress course={course} className="w-full gap-2" />
      <div className="flex w-full items-center justify-between gap-2 rounded-lg bg-sko-bg-subtle px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className={cn(OVERLINE, "shrink-0")}>{overline}</span>
          <span className="sk-text-body-medium-medium min-w-0 flex-1 truncate text-sko-text-default">{nextTitle}</span>
        </div>
        {next ? <TopicTypeBadge type={next.type} className="shrink-0" /> : null}
      </div>
      {/* mt-auto: in a row of cards with titles of different length, the action stays at the bottom. */}
      <Action
        course={course}
        hierarchy={emphasis}
        label={actionLabel}
        onAction={onAction}
        className={cn("mt-auto", inRow && "w-full")}
      />
    </article>
  );
}
