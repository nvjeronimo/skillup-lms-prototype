import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button, type ButtonHierarchy } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { certificatePageHref } from "@/lib/platform/hrefs";
import type { MyLearningCourse } from "@/lib/platform/my-learning";
import { Icon } from "@/lib/icons";
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
   * bare; List is the same row as on My Learning; in Grid the action fills the width.
   */
  context?: "card" | "row";
  /** Called by the action of a course without a page (`course.href` unset). */
  onAction?: () => void;
  className?: string;
}

/* DS `Overline` ("UP NEXT"): body-small/Semibold in capitals, no letter spacing, text/subtle. */
const OVERLINE = "sk-text-body-small-semibold uppercase text-sko-text-subtle";

/* DS progress: "{n}% complete" or "Not started" + the effort on the right, then the 8px bar
   (bg/muted track, bg/info fill, straight ends). DS `State=Completed` (13 Oct 2026): a
   check-circle in icon/success before "Completed" and the fill in bg/success. */
function Progress({ course, hug = false, className }: { course: MyLearningCourse; hug?: boolean; className?: string }) {
  const pct = course.progressPct ?? 0;
  const complete = pct >= 100;
  const label = course.progressPct === null ? "Not started" : complete ? "Completed" : `${pct}% complete`;
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Grid: the label fills and the effort sits at the right end. List (`hug`): both hug, 24 apart. */}
      <div className={cn("flex items-center", hug ? "gap-6" : "justify-between gap-2")}>
        <span className="sk-text-body-large-semibold inline-flex items-center gap-1.5 whitespace-nowrap text-sko-text-default">
          {complete ? <Icon icon={CheckCircle2} size={16} className="text-sko-icon-success" aria-hidden="true" /> : null}
          {label}
        </span>
        <span className="sk-text-body-medium-regular whitespace-nowrap text-sko-text-subtle">{course.progressMeta}</span>
      </div>
      <PlatformProgressBar track="muted" tone={complete ? "complete" : "progress"} value={pct} label={`${course.title} progress`} />
    </div>
  );
}

/* The whole card opens the course's Course Detail page when it has one (asked by Nelson on
   10 Oct 2026): the title is the link and its ::after covers the card, so the card has one
   accessible name and the action stays a separate control above it. */
function CourseTitle({ course }: { course: MyLearningCourse }) {
  return course.detailHref ? (
    <Link href={course.detailHref} className="hover:underline after:absolute after:inset-0 after:content-['']">
      {course.title}
    </Link>
  ) : (
    <>{course.title}</>
  );
}

/* The second action of a completed grid card. Written "View Certificate", as in the DS
   (Nelson, 13 Oct 2026); the completed program card uses the same label. */
const CERTIFICATE_CTA = "View Certificate";

/* Every card has the same height whatever its title (asked by Nelson on 10 Oct 2026): the
   title keeps the height of two lines and is cut at the second. The full title stays in the
   `title` attribute and in the link's name. */
const TITLE_TWO_LINES = "line-clamp-2";

/* Buttons/Button sm is 36 tall as drawn (DS Course-Card since 10 Oct 2026); on mobile the target
   grows to 44 without moving the layout (an invisible 4px band above and below). */
const TARGET_44 =
  "max-md:before:absolute max-md:before:inset-x-0 max-md:before:-inset-y-1 max-md:before:content-['']";

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
    <ButtonLink href={course.href} hierarchy={hierarchy} size="sm" aria-label={label} className={cn("relative z-[1]", TARGET_44, className)}>
      {course.cta}
    </ButtonLink>
  ) : (
    <Button hierarchy={hierarchy} size="sm" aria-label={label} onClick={onAction} className={cn("relative z-[1]", TARGET_44, className)}>
      {course.cta}
    </Button>
  );
}

/**
 * DS `LMS / Course Card` as used on My Learning and inside the Program page's course rows:
 * Layout=Grid and Layout=List. bg/page, 1px border/subtle, radius 12, Shadows/shadow-card.
 * The DS stroke takes part in the layout, so the CSS border adds to the padding.
 *
 * Grid: padding 24 / 20 / 16 (desktop / tablet / mobile), gap 16: header (thumb 86 + a line
 * with the Course Type badge on the left and the provider on the right, then the title), the Difficulty and Delivery badges, progress (gap 8), the
 * one-line up-next strip and a Buttons/Button lg.
 * List: one row, padding 16, gap 24: thumb, titles (the Course Type line with the provider at
 * its right end, the title, then the badges), progress 280 wide (gap 6), then the up-next block (overline, title, topic type)
 * with a secondary Buttons/Button sm inside it. The progress block hugs its line and the
 * up-next block is 250 wide, so the titles take the rest of the row.
 * A complete course (DS `State=Completed`) reads "Completed" with a check over a full green bar, and its strip carries the certificate
 * line ("CERTIFICATE · Issued …") instead of the next unit; the action is Review, and the grid
 * card adds a Primary "View Certificate" beside it.
 * The thumbnail shows the course image over the initials (DS `Show image`).
 * The action opens the course, so it is a link with the button look (atoms/ButtonLink).
 *
 * The older `organisms/CourseCard` is the previous List layout (overflow menu, "Est.
 * completion", 80px thumb). The course hub that used it is gone (9 Oct 2026); it stays as
 * the Storybook reference of that layout, and this card is built on its own.
 *
 * "UP NEXT" is body-small/Semibold in capitals (DS `Overline`), as on the program card.
 */
export function MyLearningCourseCard({
  course,
  layout,
  emphasis = "secondary",
  context = "card",
  onAction,
  className,
}: MyLearningCourseCardProps) {
  const inRow = context === "row";
  const surface = inRow ? "" : "rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card";
  // The card is the target of its title link; a card of its own shows it on hover.
  const clickable = cn("relative", course.detailHref && !inRow && "transition-colors has-[h3_a:hover]:border-sko-border-default");
  // Unique name per card (WCAG 2.4.6); the visible label stays first.
  const actionLabel = `${course.cta} ${course.title}`;
  const next = "certificate" in course.upNext ? null : course.upNext;
  const overline = next ? "Up next" : "Certificate";
  const nextTitle = "certificate" in course.upNext ? course.upNext.certificate : course.upNext.title;
  // A completed course with a certificate: the grid card also offers the certificate page.
  const certificateHref = "certificate" in course.upNext ? certificatePageHref(course.id) : null;

  if (layout === "list") {
    return (
      <article className={cn(surface, clickable, "flex items-center gap-6 p-4", className)}>
        <CourseThumb
          initials={course.initials}
          imageSrc={course.imageSrc}
          className="size-[86px]"
        />
        <div className="flex min-w-[200px] flex-1 flex-col gap-0.5">
          {/* DS List (Nelson, 13 Oct 2026): the provider or partner sits on the Course Type line,
              16 after the badge (in the grid card it goes to the right end of that line); the
              badges keep the line under the title. */}
          <div className="flex w-full items-center gap-4">
            <CourseTypeBadge value="Course" />
            <ProviderBadge value={course.provider} />
          </div>
          <h3
            title={course.title}
            // DS List (10 Oct 2026): 120 tall with an 86 thumb, so the title is one line and a
            // longer one is cut, in My Learning and in a course row alike (the screens nest the
            // same Course-Card, 1198 × 118, in `Program-Detail/Course-Row`).
            className="sk-text-title-large-semibold line-clamp-1 text-sko-text-default"
          >
            <CourseTitle course={course} />
          </h3>
          <div className="flex items-start gap-2">
            <DifficultyBadge value={course.difficulty} />
            <DeliveryModeBadge value={course.delivery} />
          </div>
        </div>
        {/* DS List: the progress block hugs its line ("45% complete", 24, "8 hours total"). */}
        <Progress course={course} hug className="shrink-0 gap-1.5" />
        <div
          // The DS footer is 250 wide and hugs its content (86 with the topic type, 60 for a
          // completed course); the title takes what the action leaves.
          className="flex w-[250px] min-w-0 shrink-0 items-center gap-4 rounded-lg bg-sko-bg-subtle px-3 py-2"
        >
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
            <span className={OVERLINE}>{overline}</span>
            <span
              // One line, cut at the width the footer leaves.
              className="sk-text-body-medium-medium w-full truncate text-sko-text-default"
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
    <article className={cn(surface, clickable, "flex flex-col items-start gap-4 p-4 md:p-5 lg:p-6", className)}>
      <div className="flex w-full items-start gap-4">
        <CourseThumb initials={course.initials} imageSrc={course.imageSrc} className="size-[86px]" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {/* DS Grid (Nelson, 13 Oct 2026): the provider or partner sits at the right end of the
              Course Type line, not under the title. */}
          <div className="flex w-full items-center justify-between gap-0.5">
            <CourseTypeBadge value="Course" />
            <ProviderBadge value={course.provider} />
          </div>
          <h3 title={course.title} className={cn("sk-text-title-large-semibold min-h-[2lh] text-sko-text-default", TITLE_TWO_LINES)}>
            <CourseTitle course={course} />
          </h3>
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
      {certificateHref ? (
        // DS `State=Completed`, Grid (Nelson, 13 Oct 2026): Review (Secondary) and, 12 after it,
        // a Primary that opens the certificate. Both hug their label.
        <div className="mt-auto flex w-full flex-wrap items-center gap-3">
          <Action course={course} hierarchy="secondary" label={actionLabel} onAction={onAction} />
          <ButtonLink
            href={certificateHref}
            hierarchy="primary"
            size="sm"
            aria-label={`${CERTIFICATE_CTA} ${course.title}`}
            className={cn("relative z-[1]", TARGET_44)}
          >
            {CERTIFICATE_CTA}
          </ButtonLink>
        </div>
      ) : (
        <Action
          course={course}
          hierarchy={emphasis}
          label={actionLabel}
          onAction={onAction}
          className={cn("mt-auto", inRow && "w-full")}
        />
      )}
    </article>
  );
}
