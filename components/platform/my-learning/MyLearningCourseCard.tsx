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
  /** `list-stacked` (DS Layout=List stacked, 23 Oct 2026): the tablet list, the progress above the Up next box. */
  layout: "grid" | "list" | "list-stacked";
  /**
   * `card` (My Learning): the card draws its own border, radius and shadow.
   * `row` (the Program page's `Course-Row`): the row's container draws them and the card is
   * bare; List is the same row as on My Learning; in Grid the action fills the width.
   */
  context?: "card" | "row";
  /** Called by the action of a course without a page (`course.href` unset). */
  onAction?: () => void;
  /**
   * Every action Secondary, Resume too: the Program page, whose header already carries the
   * page's Primary "Resume course" (Figma 04 · Program Detail; Nelson, 28 Oct 2026).
   */
  secondaryAction?: boolean;
  className?: string;
}

/* DS `Overline` ("UP NEXT"): body-small/Semibold in capitals, no letter spacing, text/subtle. */
const OVERLINE = "sk-text-body-small-semibold uppercase text-sko-text-subtle";
/* On the green certificate strip text/subtle drops to 3.3:1 in dark; the default ink holds AA
   in both themes (WCAG wins over the DS, PRODUCT.md). */
const OVERLINE_ON_GREEN = "sk-text-body-small-semibold uppercase text-sko-text-default";

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
      {/* DS `State=Not started` (v1.4): no bar, a 0% bar says nothing. */}
      {course.progressPct === null ? null : (
        <PlatformProgressBar track="muted" tone={complete ? "complete" : "progress"} value={pct} label={`${course.title} progress`} />
      )}
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

/* DS v1.6 (15 Oct 2026, Nelson): the hierarchy follows the action, not the card. Resume is
   always Primary; Start, Review and View Certificate are Secondary. */
const hierarchyOf = (course: MyLearningCourse): ButtonHierarchy => (course.cta === "Resume" ? "primary" : "secondary");

/* DS v1.7 (15 Oct 2026, Nelson): the Grid strip is grey (bg/subtle) beside a Primary action and
   white with a 1px border/subtle beside a Secondary one (Not started, Completed). The border is
   drawn inside the box, so the padding loses its pixel. */
const STRIP = {
  filled: "bg-sko-bg-subtle px-3 py-2",
  outlined: "border border-sko-border-subtle px-[11px] py-[7px]",
  /* DS v1.8 (15 Oct 2026, Nelson): the certificate strip of a completed course is green. */
  completed: "border border-sko-border-success-soft bg-sko-bg-accent-green-soft px-[11px] py-[7px]",
};
const stripOf = (course: MyLearningCourse, hierarchy: ButtonHierarchy) =>
  "certificate" in course.upNext ? STRIP.completed : hierarchy === "primary" ? STRIP.filled : STRIP.outlined;

/* The second action of a completed grid card. Written "View Certificate", as in the DS
   (Nelson, 13 Oct 2026); the completed program card uses the same label. */
const CERTIFICATE_CTA = "View Certificate";

function CertificateAction({ course, href, className }: { course: MyLearningCourse; href: string; className?: string }) {
  return (
    <ButtonLink
      href={href}
      hierarchy="secondary"
      size="sm"
      aria-label={`${CERTIFICATE_CTA} ${course.title}`}
      className={cn("relative z-[1]", TARGET_44, className)}
    >
      {CERTIFICATE_CTA}
    </ButtonLink>
  );
}

/* Every card has the same height whatever its title (asked by Nelson on 10 Oct 2026): the
   title keeps the height of two lines and is cut at the second. Only where cards sit side by
   side (md and up): on a phone they stack, so a one-line title takes one line (Nelson, 25 Oct
   2026: the phone cards were too tall). The full title stays in the
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
 * card adds a Secondary "View Certificate" beside it (v1.6).
 * Not started (v1.4): no bar, "Starts with" + the first topic, Start.
 * The thumbnail shows the course image over the initials (DS `Show image`).
 * The action opens the course, so it is a link with the button look (atoms/ButtonLink).
 *
 * The older `organisms/CourseCard` is the previous List layout (overflow menu, "Est.
 * completion", 80px thumb). The course hub that used it is gone (9 Oct 2026); it stays as
 * the Storybook reference of that layout, and this card is built on its own.
 *
 * "UP NEXT" is body-small/Semibold in capitals (DS `Overline`), as on the program card.
 */

/** DS Course-Card 1.10: the provider and partners as logo badges, 8 apart (Partner 1, Partner 2). */
function CoursePartners({ course }: { course: MyLearningCourse }) {
  const list = course.partners?.length ? course.partners : [course.provider];
  return (
    <ul aria-label="Provider and partners" className="flex items-center gap-2">
      {list.map((p) => (
        <li key={p} className="flex">
          {/* White chip on the course card (Nelson, 22 Oct 2026), as in the page headers. */}
          <ProviderBadge value={p} type="logo" chip="page" />
        </li>
      ))}
    </ul>
  );
}

export function MyLearningCourseCard({
  course,
  layout,
  context = "card",
  onAction,
  secondaryAction = false,
  className,
}: MyLearningCourseCardProps) {
  const inRow = context === "row";
  const surface = inRow ? "" : "rounded-card border border-sko-border-subtle bg-sko-bg-page shadow-sk-card";
  // The card is the target of its title link; a card of its own shows it on hover.
  const clickable = cn("relative", course.detailHref && !inRow && "sk-press-card transition-colors has-[h3_a:hover]:border-sko-border-default");
  // Unique name per card (WCAG 2.4.6); the visible label stays first.
  const actionLabel = `${course.cta} ${course.title}`;
  const next = "certificate" in course.upNext ? null : course.upNext;
  const overline = next ? "Up next" : "Certificate";
  const nextTitle = "certificate" in course.upNext ? course.upNext.certificate : course.upNext.title;
  // A completed course with a certificate: the grid card also offers the certificate page.
  const certificateHref = "certificate" in course.upNext ? certificatePageHref(course.id) : null;
  const hierarchy: ButtonHierarchy = secondaryAction ? "secondary" : hierarchyOf(course);
  const overlineText = course.progressPct === null ? "Starts with" : overline;

  if (layout === "list" || layout === "list-stacked") {
    const stacked = layout === "list-stacked";
    return (
      // DS Course-Card 1.15 (Nelson, 19 Oct 2026): List min height 146, the height with a two-line title,
      // so a list of one-line titles keeps the same height; the rows of a collection match (useEqualHeights).
      <article data-card-grid="" className={cn(surface, clickable, "group flex min-h-[146px] items-center gap-6 overflow-hidden p-4", className)}>
        {/* The course picture down the left edge, full height (Nelson, 22 Oct 2026: the picture
            large); it replaced the 84px thumb. */}
        <CourseThumb shape="cover" initials={course.initials} imageSrc={course.imageSrc} className="-my-4 -ml-4 w-[300px] max-w-[40%] shrink-0 self-stretch" />
        <div className={cn("flex flex-1 basis-0 items-center gap-3", stacked ? "min-w-0" : "min-w-[298px]")}>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {/* DS List (Nelson, 13 Oct 2026): the provider or partner sits on the Course Type line,
              16 after the badge (in the grid card it goes to the right end of that line); the
              badges keep the line under the title. */}
          <div className="flex w-full items-center gap-4">
            <CourseTypeBadge value="Course" />
            <CoursePartners course={course} />
          </div>
          <h3
            title={course.title}
            // DS Course-Card 1.14 (Nelson, 17 Oct 2026): the title takes up to two lines, then an
            // ellipsis, in every variant. List was one line (118 tall); a two-line title makes the row
            // taller, in My Learning and in a course row alike (`Program-Detail/Course-Row` nests it).
            className={cn("sk-text-title-large-semibold text-sko-text-default", TITLE_TWO_LINES)}
          >
            <CourseTitle course={course} />
          </h3>
          <div className="flex items-start gap-2">
            <DifficultyBadge value={course.difficulty} />
            <DeliveryModeBadge value={course.delivery} />
          </div>
        </div>
        </div>
        {/* DS List stacked (tablet): the progress and the footer share one Status column, the
            progress on top (gap 12), so the title keeps half the width. */}
        <div className={stacked ? "flex min-w-0 flex-1 basis-0 flex-col gap-3" : "contents"}>
        {/* DS List: the progress block hugs its line ("45% complete", 24, "8 hours total"). */}
        <Progress course={course} hug={!stacked} className="shrink-0 gap-1.5" />
        <div
          // DS List: the footer fills what the titles and the progress leave; grey beside Resume,
          // white with a border beside Start, green when completed (v1.8). Its height hugs.
          // Narrow stacked rows wrap the action under the title rather than cut a word in it.
          className={cn("flex flex-wrap items-center gap-4 rounded-control", stacked ? "w-full" : "min-w-[250px] flex-1", stripOf(course, hierarchy))}
        >
          <div className="flex min-w-[9rem] flex-1 flex-col items-start gap-1.5">
            {/* DS v1.11 (Nelson, 16 Oct 2026): the overline and the topic type share one row, 16
                apart, so the title below has the footer's full width (two lines, then cut). */}
            {/* The overline stays on one line ("Starts with" broke in two at 1280, Nelson 28 Oct 2026). */}
            <div className="flex items-center gap-4">
              <span className={cn(next ? OVERLINE : OVERLINE_ON_GREEN, "whitespace-nowrap")}>{overlineText}</span>
              {next ? <TopicTypeBadge type={next.type} className="shrink-0" /> : null}
            </div>
            <span className="sk-text-body-medium-medium line-clamp-2 w-full text-sko-text-default">{nextTitle}</span>
          </div>
          {certificateHref ? (
            // DS v1.8 (Nelson): a completed course in the list offers its certificate; the
            // title still opens the course page to review it.
            <CertificateAction course={course} href={certificateHref} className="shrink-0" />
          ) : (
            <Action course={course} hierarchy={hierarchy} label={actionLabel} onAction={onAction} className="shrink-0" />
          )}
        </div>
        </div>
      </article>
    );
  }

  return (
    <article data-card-grid="" className={cn(surface, clickable, "group flex flex-col items-start gap-4 overflow-hidden p-4 md:p-5 lg:p-6", className)}>
      {/* The course picture across the top, edge to edge (Nelson, 22 Oct 2026: the picture large);
          it replaced the 64px thumb beside the title. On a phone the box is 5:2 (Nelson, 25 Oct
          2026: smaller, the proportion kept): the 2:1 picture fills it, cropped top and bottom,
          never stretched; from md the box is 2:1 again. */}
      <CourseThumb
        shape="cover"
        initials={course.initials}
        imageSrc={course.imageSrc}
        className="-mx-4 -mt-4 aspect-[5/2] w-[calc(100%+2rem)] md:aspect-[2/1] md:-mx-5 md:-mt-5 md:w-[calc(100%+2.5rem)] lg:-mx-6 lg:-mt-6 lg:w-[calc(100%+3rem)]"
      />
      {/* DS v1.8 header (Nelson, 15 Oct 2026), gap 12: the Course Type line across the card
          (provider at its right end), then the title, then the badges (the picture is above, 22 Oct 2026).
          In a row of cards stretched to one height, the header takes the extra space and the
          badges sit at its bottom, so badges, progress, footer and action line up at the bottom
          of every card (Nelson, 19 Oct 2026). */}
      <div className="flex w-full flex-1 flex-col gap-3">
        <div className="flex w-full flex-wrap items-center justify-between gap-0.5">
          <CourseTypeBadge value="Course" />
          <CoursePartners course={course} />
        </div>
        <h3 title={course.title} className={cn("sk-text-title-large-semibold w-full md:min-h-[2lh] min-w-0 text-sko-text-default", TITLE_TWO_LINES)}>
          <CourseTitle course={course} />
        </h3>
        <div className="mt-auto flex flex-wrap items-start gap-2">
          <DifficultyBadge value={course.difficulty} />
          <DeliveryModeBadge value={course.delivery} />
        </div>
      </div>
      <Progress course={course} className="w-full gap-2" />
      {next ? (
        // The next topic (or, not started, the first one). DS v1.11 (Nelson, 16 Oct 2026): the
        // overline and the topic type share the top row (type at the right end), so the title
        // below has the strip's full width; it wraps to two lines before it is cut.
        <div className={cn("flex w-full flex-col gap-0.5 rounded-control", hierarchy === "primary" ? STRIP.filled : STRIP.outlined)}>
          <div className="flex w-full items-center justify-between gap-0.5">
            <span className={next ? OVERLINE : OVERLINE_ON_GREEN}>{overlineText}</span>
            <TopicTypeBadge type={next.type} className="shrink-0" />
          </div>
          <span className="sk-text-body-medium-medium line-clamp-2 text-sko-text-default">{nextTitle}</span>
        </div>
      ) : (
        // The certificate: the date at the right end (DS State=Completed). It drops under the
        // overline, whole, when the card is too narrow, never cut (desktop text 15, 29 Oct 2026).
        <div className={cn("flex w-full flex-wrap items-center gap-x-3 gap-y-0.5 rounded-control", STRIP.completed)}>
          <span className={cn(OVERLINE_ON_GREEN, "shrink-0")}>{overline}</span>
          <span className="sk-text-body-medium-medium ml-auto whitespace-nowrap text-sko-text-default">{nextTitle}</span>
        </div>
      )}
      {certificateHref ? (
        // DS `State=Completed`, Grid (v1.6, 15 Oct 2026): Review and View Certificate, both
        // Secondary, 12 apart, sharing the width.
        <div className="flex w-full items-center gap-3">
          <Action course={course} hierarchy="secondary" label={actionLabel} onAction={onAction} className="flex-1" />
          <CertificateAction course={course} href={certificateHref} className="flex-1" />
        </div>
      ) : (
        <Action
          course={course}
          hierarchy={hierarchy}
          label={actionLabel}
          onAction={onAction}
          // DS v1.8: the action fills the card's width.
          className="w-full"
        />
      )}
    </article>
  );
}
