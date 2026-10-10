"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import {
  myLearningProgramProgressLabel,
  myLearningProgramUpNextLabel,
  type MyLearningProgram,
} from "@/lib/platform/my-learning";
import { useLmsStore } from "@/lib/store";
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
 * Hero (DS change of 10 Oct 2026, the same on the four variants): a dark surface, bg/subtle
 * with the Semantics collection pinned to Dark. Top row: the Course Type badge "Program" and
 * the partner logos (36 tall chips); the title (headline-medium/Semibold, text/default); the
 * Delivery Mode and Difficulty badges; the courses line ("1 of 7 courses complete",
 * body-small/Medium at 80 %). The eyebrow "Program · N courses" left the component with its
 * property. Decoration: a 340 ring with a 56 stroke in bg/primary at 8 %, low on the left, and
 * a 207 circle of diagonal hatch (border/primary) at 35 %, high on the right; both are clipped
 * by the hero.
 * Body, gap 16: the percent (headline-medium/Bold) with its label, the DS Progress bar
 * (8 tall, square, bg/strong track, bg/info fill, stepped by 10: nearest step), then the
 * footer — In progress: "Up next" + a primary "Continue"; Not started: a Badge v2 Gray
 * status + a secondary "Details" (Buttons/Button sm). The action is a link with the button
 * look (atoms/ButtonLink) when the program has a page, a button otherwise.
 * Padding of hero and body follows the DS spacing mode: 24 desktop, 20 tablet, 16 mobile.
 * Grid: stacked. The title keeps the height of three lines and is cut at the third (DS change
 * of 10 Oct 2026), so every hero is 248 tall on desktop. The footer has one height in both
 * states, so every program card is the same height whatever it holds (Nelson, 10 Oct 2026;
 * the DS draws 408 for In progress and 404 for Not started).
 * List: min height 280, hero 502 wide with its content spread top to bottom; the title is cut
 * at two lines; the body spreads too, progress at the top and the footer at the bottom (it
 * was centred until 10 Oct 2026).
 * Everything on the card comes from `relatedPrograms` and `progress_details` (handoff map
 * §37.4), so it carries no sample-data mark.
 *
 * The courses line keeps the DS 80 % layer opacity: on the dark hero it stays well above AA.
 */
export function ProgramCard({ program, layout, onAction, className }: ProgramCardProps) {
  const list = layout === "list";
  // Unique name per card (WCAG 2.4.6); the visible label stays first.
  const actionLabel = `${program.cta} ${program.title}`;
  // DS, 10 Oct 2026: the action is Secondary in both states.
  const hierarchy = "secondary";
  const skin = useLmsStore((st) => st.skin);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

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
        // The DS hero pins the Semantics collection to Dark: every token below resolves dark in
        // both app themes. The brand skin lives on <html>, so a nested dark band repeats it.
        data-theme="dark"
        data-skin={mounted && skin !== "teal" ? skin : undefined}
        className={cn(
          "relative flex flex-col items-start gap-3 overflow-hidden bg-sko-bg-subtle p-4 md:p-5 lg:px-[23px] lg:py-6",
          list ? "w-[42%] shrink-0 justify-between xl:w-[502px]" : "w-full",
        )}
      >
        {/* Decoration: a ring low on the left, a hatched circle high on the right. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[170px] -left-[170px] size-[340px] rounded-full border-[56px] border-sko-bg-primary opacity-[0.08]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[79px] -top-1 size-[207px] rounded-full opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-border-primary) 0 1px, transparent 1px 7.07px)",
          }}
        />
        <div className="relative flex w-full flex-col gap-3">
          <div className="flex w-full flex-col gap-1">
            <div className="flex min-h-9 w-full items-center justify-between gap-2">
              <CourseTypeBadge value="Program" />
              {program.partners.length ? (
                <ul
                  aria-label="Partners"
                  data-mock="Partner logos have no field: org is the platform's own key"
                  className="flex items-center gap-3"
                >
                  {program.partners.map((partner) => (
                    <li
                      key={partner.name}
                      className="flex h-9 w-[77px] items-center justify-center rounded border border-sko-text-on-primary bg-sko-bg-page p-[3px]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={partner.logoSrc} alt={partner.name} width={69} height={28} className="h-7 w-[69px] object-contain" />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <h3
              title={program.title}
              className={cn(
                "sk-text-headline-medium-semibold text-sko-text-default",
                // Grid keeps room for three lines and cuts a longer title there, so cards in a row
                // have the same hero; List cuts at two.
                list ? "line-clamp-2" : "line-clamp-3 min-h-[3lh]",
              )}
            >
              {program.href ? (
                <Link href={program.href} className="hover:underline">
                  {program.title}
                </Link>
              ) : (
                program.title
              )}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DeliveryModeBadge value={program.delivery} />
            <DifficultyBadge value={program.difficulty} />
          </div>
        </div>
        <p className="sk-text-body-small-medium relative text-sko-text-default opacity-80">{program.courses}</p>
      </div>

      <div className={cn("flex min-w-0 flex-col gap-4 p-4 md:p-5 lg:px-[23px] lg:py-6", list ? "flex-1 justify-between" : "w-full")}>
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
        {/* DS footer, 10 Oct 2026: a box 60 tall in both states, so every card has one height.
            In progress: on bg/subtle, "Up next" over the course name (Semibold) on one line, cut
            when longer.
            Not started: a 1px border/subtle box with the status and Details. */}
        <div
          className={cn(
            "flex min-h-[60px] items-center justify-between gap-4 rounded-lg",
            // The border is drawn inside the box: 1px less padding keeps both states 60 tall.
            program.upNext ? "bg-sko-bg-subtle px-3 py-2" : "border border-sko-border-subtle px-[11px] py-[7px]",
          )}
        >
          {program.upNext ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="sk-text-body-small-semibold text-sko-text-subtle">{myLearningProgramUpNextLabel}</span>
              <span title={program.upNext} className="sk-text-body-medium-semibold truncate text-sko-text-default">
                {program.upNext}
              </span>
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
