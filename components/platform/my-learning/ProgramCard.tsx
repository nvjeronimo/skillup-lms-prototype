import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { DeliveryModeBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import {
  myLearningProgramProgressLabel,
  myLearningProgramUpNextLabel,
  type MyLearningProgram,
} from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";

export interface ProgramCardProps {
  program: MyLearningProgram;
  /** DS `Layout`: Grid is stacked, List puts the hero on the left (desktop only). */
  layout: "grid" | "list";
  /** Called by the action of a program without a page (`program.href` unset). */
  onAction?: () => void;
  className?: string;
}

/* Buttons/Button sm is 36 tall as drawn; on mobile the target grows to 44 without moving
   the layout (an invisible 4px band above and below). */
const TARGET_44 =
  "relative z-[2] shrink-0 max-md:before:absolute max-md:before:inset-x-0 max-md:before:-inset-y-1 max-md:before:content-['']";

/**
 * DS `LMS/Platform/My-Learning/Program-Card`: one program in My Learning. White card,
 * 1px border/subtle, radius 8, no shadow.
 * Hero on bg/primary, gap 12: the Delivery Mode badge, the eyebrow (label-small/Semibold),
 * the title (headline-medium/Semibold) and the courses line ("1 of 7 courses complete",
 * body-small/Medium), all text/on-primary. `Week`, `Lessons` and `Show cohort` left the DS
 * component on 8 Oct: Open edX has no cohort, week or lesson counter for a program.
 * The ring is decoration:
 * a 340 circle with a 56 stroke in bg/on-media at 8 %, clipped by the hero.
 * Body, gap 16: the percent (headline-medium/Bold) with its label, the DS Progress bar
 * (8 tall, square, bg/strong track, bg/info fill, stepped by 10: nearest step), then the
 * footer — In progress: "Up next" + a primary "Continue"; Not started: a Badge v2 Gray
 * status + a secondary "Details" (Buttons/Button sm). The action is a link with the button
 * look (atoms/ButtonLink) when the program has a page, a button otherwise.
 * Padding of hero and body follows the DS spacing mode: 24 desktop, 20 tablet, 16 mobile.
 * Grid: stacked, cards keep their own height (384 × 370 and 384 × 404 on desktop).
 * List: min height 280, hero 502 wide with its content spread top to bottom, body centred.
 * Everything on the card comes from `relatedPrograms` and `progress_details` (handoff map
 * §37.4), so it carries no sample-data mark.
 *
 * Known open issue: the DS draws the eyebrow at 70 % and the courses line at 80 % layer opacity,
 * which fails AA on bg/primary. Both are text/on-primary at 100 % here.
 */
export function ProgramCard({ program, layout, onAction, className }: ProgramCardProps) {
  const list = layout === "list";
  // Unique name per card (WCAG 2.4.6); the visible label stays first.
  const actionLabel = `${program.cta} ${program.title}`;
  const hierarchy = program.cta === "Continue" ? "primary" : "secondary";

  return (
    <article
      className={cn(
        // The DS stroke is drawn inside the 384 card; the CSS border sits outside the padding,
        // so the desktop side padding is 23 (+1 border = the DS 24 inset). The height already matches with 24.
        "relative flex overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-page",
        program.href && "transition-colors has-[a:hover]:border-sko-border-default",
        list ? "min-h-[280px] items-stretch" : "flex-col",
        className,
      )}
    >
      {/* The whole card opens the program page (asked by Nelson on 10 Oct 2026). The hero clips
          its content, so the title link cannot be stretched over the card: this second link
          covers it for the pointer only (the title is the one keyboards and readers reach), and
          the action stays a separate control above it. */}
      {program.href ? (
        <Link href={program.href} aria-hidden="true" tabIndex={-1} className="peer absolute inset-0 z-[1]" />
      ) : null}
      <div
        className={cn(
          "relative flex flex-col items-start gap-3 overflow-hidden bg-sko-bg-primary p-4 md:p-5 lg:px-[23px] lg:py-6",
          list ? "w-[42%] shrink-0 justify-between xl:w-[502px]" : "w-full",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-[-70px] size-[340px] rounded-full border-[56px] border-sko-bg-on-media opacity-[0.08]",
            list ? "right-[-140px]" : "right-[-142px]",
          )}
        />
        <div className="relative flex flex-wrap items-center gap-2">
          <DeliveryModeBadge value={program.delivery} />
        </div>
        <div className="relative flex w-full flex-col gap-1 text-sko-text-on-primary">
          <p className="sk-text-label-small-semibold">{program.eyebrow}</p>
          <h3 className="sk-text-headline-medium-semibold">
            {program.href ? (
              <Link href={program.href} className="hover:underline">
                {program.title}
              </Link>
            ) : (
              program.title
            )}
          </h3>
        </div>
        <p className="sk-text-body-small-medium relative text-sko-text-on-primary">{program.courses}</p>
      </div>

      <div className={cn("flex min-w-0 flex-col gap-4 p-4 md:p-5 lg:px-[23px] lg:py-6", list ? "flex-1 justify-center" : "w-full")}>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="sk-text-headline-medium-bold text-sko-text-default">{program.progressPct}%</span>
            <span className="sk-text-label-small-semibold whitespace-nowrap text-sko-text-subtle">
              {myLearningProgramProgressLabel}
            </span>
          </div>
          {/* Stepped by 10 as the DS Progress bar; the real value goes to assistive tech. */}
          <PlatformProgressBar stepped value={program.progressPct} label={`${program.title} progress`} />
        </div>
        <div className="flex items-center justify-between gap-1">
          {program.upNext ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="sk-text-body-small-regular text-sko-text-subtle">{myLearningProgramUpNextLabel}</span>
              <span className="sk-text-body-medium-semibold text-sko-text-default">{program.upNext}</span>
            </div>
          ) : program.status ? (
            <Badge color="gray">{program.status}</Badge>
          ) : (
            <span />
          )}
          {program.actionHref ?? program.href ? (
            <ButtonLink href={(program.actionHref ?? program.href)!} hierarchy={hierarchy} size="sm" aria-label={actionLabel} className={TARGET_44}>
              {program.cta}
            </ButtonLink>
          ) : (
            <Button hierarchy={hierarchy} size="sm" onClick={onAction} aria-label={actionLabel} className={TARGET_44}>
              {program.cta}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
