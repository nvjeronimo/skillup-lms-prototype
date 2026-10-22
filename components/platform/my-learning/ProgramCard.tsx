"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseCountBadge, CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CourseThumb } from "./CourseThumb";
import {
  myLearningProgramCertificateLabel,
  myLearningProgramCompletedLabel,
  myLearningProgramNotStartedLabel,
  myLearningProgramUpNextLabel,
  type MyLearningProgram,
} from "@/lib/platform/my-learning";
import { Icon } from "@/lib/icons";
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

/** The Program card's frame; its skeleton reuses it. */
export const PROGRAM_CARD_FRAME = "relative flex overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page";

/**
 * DS `LMS/Platform/My-Learning/Program-Card`: one program in My Learning. White card,
 * 1px border/subtle, radius 8, no shadow.
 * Hero (DS change of 10 Oct 2026, the same on the four variants): a dark surface, bg/subtle
 * with the Semantics collection pinned to Dark. Top row: the Course Type badge "Program" and
 * the partner logos (Provider-Partner-Badge Type=Logo, Theme=Dark, 24 tall); the title (title-large/Semibold since DS v1.9, text/default); the
 * Delivery Mode and Difficulty badges (the courses line moved to the body on 15 Oct 2026). The eyebrow "Program · N courses" left the component with its
 * property. Decoration: a 340 ring with a 56 stroke in bg/primary at 8 %, low on the left, and
 * a 207 circle of diagonal hatch (border/primary) at 35 %, high on the right; both are clipped
 * by the hero.
 * Body, gap 16 (DS v1.4–1.5, 14–15 Oct 2026): progress said once — "1 of 7 courses complete"
 * (18 Semibold) over the DS Progress bar (8 tall, square, bg/strong track, bg/info fill,
 * stepped by 10: nearest step); no percent, and the courses line left the hero. Then the
 * footer, 60 tall — In progress: on bg/subtle, "Up next" + a Primary "Resume"; Not started:
 * "Not started" over an empty bar, and a white footer (1px border/subtle) with a Badge Gray
 * start date + a Secondary "Start"; Completed: the same white footer with "Certificate
 * issued", the date and a Secondary "View Certificate". The footer is grey beside a Primary
 * action and white beside a Secondary one (Nelson, 15 Oct 2026). The action is a link with
 * the button look (atoms/ButtonLink) when the program has a page, a button otherwise.
 * Completed (DS `State=Completed`, v1.1, 13 Oct 2026): the label reads "Program completed"
 * after a check-circle in icon/success, the bar is full and green (bg/success), and the
 * footer, on bg/subtle, reads "Certificate issued" over the date with "View Certificate".
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
 */
export function ProgramCard({ program, layout, onAction, className }: ProgramCardProps) {
  const list = layout === "list";
  // Unique name per card (WCAG 2.4.6); the visible label stays first.
  const actionLabel = `${program.cta} ${program.title}`;
  // DS (15 Oct 2026): Resume is Primary, Start and View Certificate are Secondary.
  const hierarchy = program.cta === "Resume" ? "primary" : "secondary";
  const completed = program.progressPct >= 100;
  // DS `State=Not started` (13 Oct 2026): the words take the place of "0%".
  const notStarted = !completed && !program.upNext && Boolean(program.status);
  const footerLabel = completed ? myLearningProgramCertificateLabel : myLearningProgramUpNextLabel;
  const footerValue = completed ? program.certificateDate : program.upNext;
  const details = [program.lastStudied, program.hours, program.accessUntil].filter(Boolean);
  const skin = useLmsStore((st) => st.skin);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <article
      data-card-grid={list ? undefined : ""}
      className={cn(
        // The DS stroke is drawn inside the 384 card; the CSS border sits outside the padding,
        // so the desktop side padding is 23 (+1 border = the DS 24 inset). The height already matches with 24.
        PROGRAM_CARD_FRAME,
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
          // The badges sit at the bottom of the hero (justify-between) in both layouts.
          "relative flex flex-col items-start justify-between gap-3 overflow-hidden bg-sko-bg-subtle p-4 md:p-5 lg:px-[23px] lg:py-6",
          list ? "w-[42%] shrink-0 xl:w-[502px]" : "w-full",
        )}
      >
        {/* Decoration: a ring low on the left, a hatched circle high on the right. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[170px] -left-[170px] size-[340px] rounded-pill border-[56px] border-sko-bg-primary opacity-[0.08]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[79px] -top-1 size-[207px] rounded-pill opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-border-primary) 0 1px, transparent 1px 7.07px)",
          }}
        />
        {/* flex-1 + justify-between: the title block at the top, the badges at the bottom of the hero
            (in the list the hero is as tall as the card). */}
        <div className="relative flex w-full flex-1 flex-col justify-between gap-3">
          {/* Title block: the type line, then the thumb and title; gap 12 in every variant (DS, Nelson, 19 Oct 2026). */}
          <div className="flex w-full flex-col gap-3">
            <div className="flex min-h-9 w-full items-center justify-between gap-2">
              <CourseTypeBadge value="Program" />
              {program.partners.length ? (
                <ul
                  aria-label="Partners"
                  data-mock="Partner logos have no field: org is the platform's own key"
                  className="flex items-center gap-3"
                >
                  {/* DS Program-Card 1.10 (16 Oct 2026): Provider-Partner-Badge Type=Logo, Theme=Dark;
                      the hero's data-theme="dark" shows the light-on-dark drawing. */}
                  {program.partners.map((partner) => (
                    <li key={partner.name} className="flex">
                      <ProviderBadge value={partner.name} type="logo" />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {/* DS v1.8: the program image, 64, beside the title (as on Course-Card 1.8). */}
            <div className="flex w-full items-start gap-3">
            <CourseThumb initials={program.initials} imageSrc={program.imageSrc} className="size-16" />
            <h3
              title={program.title}
              className={cn(
                "sk-text-title-large-semibold min-w-0 flex-1 text-sko-text-default",
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
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DeliveryModeBadge value={program.delivery} />
            <DifficultyBadge value={program.difficulty} />
            <CourseCountBadge count={program.courseCount} />
          </div>
        </div>
      </div>

      {/* The body takes the rest of the card and spreads: progress at the top, the footer (Up next,
          the start date, the certificate) at the bottom, in the grid too, so in a row of cards
          stretched to one height every footer sits on the card's bottom edge (Nelson, 19 Oct 2026). */}
      <div className={cn("flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 md:p-5 lg:px-[23px] lg:py-6", !list && "w-full")}>
        <div className="flex flex-col gap-2">
          {/* The DS sets these words in a raw 18 Semibold: title-medium/Semibold is that style. */}
          <div className="flex items-baseline justify-between gap-3">
            <p className="sk-text-title-medium-semibold inline-flex items-center gap-1.5 text-sko-text-default">
              {completed ? <Icon icon={CheckCircle2} size={20} className="text-sko-icon-success" aria-hidden="true" /> : null}
              {completed ? myLearningProgramCompletedLabel : notStarted ? myLearningProgramNotStartedLabel : program.courses}
            </p>
            {/* DS v1.7: the count at the right end, as the course card shows its hours; In progress already says it. */}
            {completed || notStarted ? (
              <span className="sk-text-body-medium-regular whitespace-nowrap text-sko-text-subtle">
                {program.courseCount} {program.courseCount === 1 ? "course" : "courses"}
              </span>
            ) : null}
          </div>
          {/* Stepped by 10 as the DS Progress bar; the real value goes to assistive tech. */}
          <PlatformProgressBar stepped tone={completed ? "complete" : "progress"} value={program.progressPct} label={`${program.title} progress`} />
          {/* DS v1.8 details line: one line, each part only when there is data; none when completed. */}
          {!completed && details.length ? (
            <p className="sk-text-body-small-regular truncate text-sko-text-subtle">{details.join(" · ")}</p>
          ) : null}
        </div>
        {/* DS footer: a box 60 tall in every state, so every card has one height. Grey
            (bg/subtle) beside the Primary Resume; white with a 1px border/subtle beside a
            Secondary action (Nelson, 15 Oct 2026). */}
        <div
          className={cn(
            "flex min-h-[60px] items-center justify-between gap-4 rounded-control",
            // The border is drawn inside the box: 1px less padding keeps every state 60 tall.
            hierarchy === "primary"
              ? "bg-sko-bg-subtle px-3 py-2"
              : completed
                ? // DS v1.6 (Nelson, 15 Oct 2026): the certificate footer is green.
                  "border border-sko-border-success-soft bg-sko-bg-accent-green-soft px-[11px] py-[7px]"
                : "border border-sko-border-subtle px-[11px] py-[7px]",
          )}
        >
          {footerValue ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              {/* On the green certificate footer text/subtle is 3.3:1 in dark: the default ink holds AA. */}
              <span className="inline-flex items-center gap-2">
                <span className={cn("sk-text-body-small-semibold", completed ? "text-sko-text-default" : "text-sko-text-subtle")}>{footerLabel}</span>
                {/* DS v1.8: the next deadline, only when the next item has one. DS v1.12 (Nelson,
                    17 Oct 2026): Soft Warning, as the Dashboard Due-Item, not the accent yellow. */}
                {!completed && program.nextDue ? (
                  <Badge variant="soft" color="warning">
                    {program.nextDue}
                  </Badge>
                ) : null}
              </span>
              <span title={footerValue} className="sk-text-body-medium-semibold truncate text-sko-text-default">
                {footerValue}
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
