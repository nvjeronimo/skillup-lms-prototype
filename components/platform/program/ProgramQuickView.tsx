"use client";

import * as React from "react";
import { Award, Check, Clock, X } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import { getProgramCertificate } from "@/lib/platform/catalog";
import { programPageHref } from "@/lib/platform/hrefs";
import type { MyLearningProgram } from "@/lib/platform/my-learning";
import { Icon } from "@/lib/icons";
import { inertProps } from "@/lib/inert";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useDialog } from "@/lib/useDialog";
import { useExitTransition } from "@/lib/useExitTransition";
import { cn } from "@/lib/utils";

export interface ProgramQuickViewProps {
  program: MyLearningProgram;
  open: boolean;
  onClose: () => void;
}

/** The slug of a program from its page link (`/platform/program/<slug>`). */
function slugOf(program: MyLearningProgram): string | undefined {
  return program.href?.split("/program/")[1]?.split(/[?#]/)[0];
}

const SECTION_TITLE = "sk-text-label-small-semibold uppercase text-sko-text-subtle";

/**
 * Program quick view (proposal, Nelson 23 Oct 2026; no DS component yet): the program's most
 * important facts without leaving the list. A centred modal (full screen on a phone), opened
 * from the card's Quick view button. Top: the type, partners, title and badges. Then, each only
 * when there is data:
 * - Progress: "N of M courses complete", the bar, the last time studied, the hours and the end
 *   of access (Learner Home, `progress_details`), and the next deadline (Dates API);
 * - Courses: every course of the program in order, with its state (done, in progress with its
 *   percent and "Up next", not started) — programs API + course progress;
 * - Certificate: issued on a date, or what is left to earn it (Certificates API);
 * - What's included: the Program page's list (courses, hours, projects…; no API, sample-data mark);
 * - About: the overview and the skills. Open edX serves no program marketing text: it is mock
 *   copy until the vendor's catalogue (handoff map §37), so it carries the sample-data mark.
 * Bottom: "Open program page" and the card's own action (Resume, Start, View Certificate).
 */
export function ProgramQuickView({ program, open, onClose }: ProgramQuickViewProps) {
  const titleId = React.useId();
  const dialogRef = useDialog(open, onClose);
  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short3);
  const slug = slugOf(program);
  const cert = slug ? getProgramCertificate(slug) : undefined;
  const detail = cert?.program;

  if (!mounted) return null;
  const closed = state === "closed";
  const completed = program.progressPct >= 100;
  const notStarted = program.progressPct === 0;
  const facts = [program.lastStudied, program.hours, program.accessUntil].filter(Boolean) as string[];
  const overview = detail?.about.find((a) => /overview/i.test(a.title))?.body?.[0];
  // One chip per skill: a program may write its skills as sentences in one paragraph.
  const skills = (detail?.about.find((a) => /skills/i.test(a.title))?.body ?? [])
    .flatMap((b) => b.split(/(?<=\.)\s+/))
    .map((t) => t.replace(/\.$/, "").trim())
    .filter(Boolean);
  const current = detail?.courses.find((c) => (c.card.progressPct ?? 0) > 0 && (c.card.progressPct ?? 0) < 100);
  const pageHref = program.href ?? (slug ? programPageHref(slug) : undefined);
  const actionHref = program.actionHref ?? program.href;
  const hierarchy = program.cta === "Resume" ? "primary" : "secondary";

  return (
    <div
      ref={dialogRef}
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      className={cn("fixed inset-0 z-[60] flex items-center justify-center md:p-6", closed && "pointer-events-none")}
    >
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onClose} onAnimationEnd={onAnimationEnd} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="sk-animate-pop relative flex h-full w-full origin-center flex-col overflow-hidden bg-sko-bg-page shadow-xl md:h-auto md:max-h-[min(720px,calc(100dvh-48px))] md:max-w-[640px] md:rounded-surface md:border md:border-sko-border-subtle"
      >
        {/* The program's identity on the dark hero of its card. */}
        <header data-theme="dark" className="relative flex shrink-0 flex-col gap-3 bg-sko-bg-subtle p-5 pr-16 md:p-6 md:pr-16">
          <div className="flex items-center gap-3">
            <CourseTypeBadge value="Program" />
            {program.partners.length ? (
              <ul aria-label="Partners" className="flex items-center gap-2">
                {program.partners.map((p) => (
                  <li key={p.name} className="flex">
                    <ProviderBadge value={p.name} type="logo" />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="flex items-start gap-3">
            <CourseThumb initials={program.initials} imageSrc={program.imageSrc} className="size-16" />
            <h2 id={titleId} className="sk-text-title-large-semibold min-w-0 flex-1 text-sko-text-default">
              {program.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DeliveryModeBadge value={program.delivery} />
            <DifficultyBadge value={program.difficulty} />
          </div>
          {/* A Secondary icon button: it reads on the dark hero in every skin (Nelson, 23 Oct 2026). */}
          <Button
            hierarchy="secondary"
            size="md"
            iconOnly
            leftIcon={X}
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute right-3 top-3 md:right-4 md:top-4"
          />
        </header>

        {/* The body scrolls: it takes the focus so a keyboard can scroll it (WCAG 2.1.1). */}
        <div tabIndex={0} aria-label="Program details" className="sk-scroll flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden p-5 md:p-6">
          {/* Progress */}
          <section aria-labelledby={`${titleId}-progress`} className="flex flex-col gap-2">
            <h3 id={`${titleId}-progress`} className={SECTION_TITLE}>
              Progress
            </h3>
            <div className="flex items-baseline justify-between gap-3">
              <p className="sk-text-title-medium-semibold text-sko-text-default">
                {completed ? "Program completed" : notStarted ? "Not started" : program.courses}
              </p>
              <span className="sk-text-body-medium-regular whitespace-nowrap text-sko-text-subtle">
                {program.courseCount} {program.courseCount === 1 ? "course" : "courses"}
              </span>
            </div>
            <PlatformProgressBar stepped tone={completed ? "complete" : "progress"} value={program.progressPct} label={`${program.title} progress`} />
            {facts.length || program.nextDue ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {facts.length ? (
                  <p className="sk-text-body-small-regular inline-flex items-center gap-1.5 text-sko-text-subtle">
                    <Icon icon={Clock} size={16} className="shrink-0 text-sko-icon-subtle" aria-hidden="true" />
                    {facts.join(" · ")}
                  </p>
                ) : null}
                {!completed && program.nextDue ? (
                  <Badge variant="soft" color="warning">
                    {program.nextDue}
                  </Badge>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Courses */}
          {detail?.courses.length ? (
            <section aria-labelledby={`${titleId}-courses`} className="flex flex-col gap-2">
              <h3 id={`${titleId}-courses`} className={SECTION_TITLE}>
                Courses
              </h3>
              <ol className="flex flex-col divide-y divide-sko-border-subtle rounded-card-inset border border-sko-border-subtle">
                {detail.courses.map((c) => {
                  const pct = c.card.progressPct ?? 0;
                  const done = pct >= 100;
                  const isCurrent = c === current;
                  return (
                    <li key={c.id} className={cn("flex items-center gap-3 px-3 py-2.5", isCurrent && "bg-sko-bg-primary-soft")}>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "sk-text-body-small-semibold inline-flex size-6 shrink-0 items-center justify-center rounded-pill",
                          done ? "bg-sko-bg-success text-sko-icon-on-media" : isCurrent ? "bg-sko-bg-primary text-sko-text-on-primary" : "bg-sko-bg-subtle text-sko-text-subtle",
                        )}
                      >
                        {done ? <Icon icon={Check} size={14} /> : c.number}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="sk-text-body-medium-medium truncate text-sko-text-default">{c.card.title}</span>
                        {/* Where the learner is in the course in progress ("Module 2 of 4 · …"). */}
                        {isCurrent && c.position ? (
                          <span className="sk-text-body-small-regular truncate text-sko-text-subtle">
                            You left off in {c.position}
                            {c.detail ? ` · ${c.detail}` : ""}
                          </span>
                        ) : null}
                      </div>
                      <span className="sr-only">{done ? "Completed" : pct > 0 ? `${pct}% complete` : "Not started"}</span>
                      <span aria-hidden="true" className="shrink-0">
                        {done ? (
                          <Badge variant="soft" color="success">Completed</Badge>
                        ) : pct > 0 ? (
                          <Badge variant="soft" color="info">{pct}%</Badge>
                        ) : (
                          <Badge color="gray">Not started</Badge>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}

          {/* Certificate */}
          {cert ? (
            <section aria-labelledby={`${titleId}-cert`} className="flex flex-col gap-2">
              <h3 id={`${titleId}-cert`} className={SECTION_TITLE}>
                Certificate
              </h3>
              <div
                className={cn(
                  "flex items-start gap-3 rounded-card-inset border p-3",
                  cert.certificate.status === "issued" ? "border-sko-border-success-soft bg-sko-bg-accent-green-soft" : "border-sko-border-subtle",
                )}
              >
                <Icon icon={Award} size={20} className={cn("mt-0.5 shrink-0", cert.certificate.status === "issued" ? "text-sko-icon-success" : "text-sko-icon-subtle")} aria-hidden="true" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="sk-text-body-medium-semibold text-sko-text-default">
                    {cert.certificate.status === "issued" ? `Issued ${program.certificateDate ?? ""}`.trim() : "Program certificate"}
                  </p>
                  <p className="sk-text-body-small-regular text-sko-text-subtle">
                    {cert.certificate.status === "issued"
                      ? "Every course of the program is complete."
                      : `Complete every course to earn it · ${cert.complete} of ${cert.courses.length} done`}
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {/* What's included: the Program page's sidebar list (Nelson, 23 Oct 2026). */}
          {detail?.included.length ? (
            <section
              aria-labelledby={`${titleId}-included`}
              data-mock="Content counts per program have no API"
              className="flex flex-col gap-2"
            >
              <h3 id={`${titleId}-included`} className={SECTION_TITLE}>
                What&apos;s included
              </h3>
              <ul className="sk-text-body-medium-regular list-disc ps-[21px] text-sko-text-default">
                {detail.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* About: mock until the vendor's catalogue */}
          {overview || skills.length ? (
            <section
              aria-labelledby={`${titleId}-about`}
              data-mock="Open edX serves no program marketing text: overview and skills wait for the vendor's catalogue"
              className="flex flex-col gap-2"
            >
              <h3 id={`${titleId}-about`} className={SECTION_TITLE}>
                About this program
              </h3>
              {overview ? <p className="sk-text-body-medium-regular text-sko-text-muted">{overview}</p> : null}
              {skills.length ? (
                <ul className="flex flex-wrap gap-2" aria-label="Skills you will gain">
                  {skills.slice(0, 6).map((s) => (
                    <li key={s} className="max-w-full">
                      {/* A long skill wraps inside its chip instead of pushing the dialog wider. */}
                      <Badge color="gray" className="max-w-full whitespace-normal">
                        {s}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-sko-border-subtle p-4 md:flex-row md:items-center md:justify-end md:px-6">
          {pageHref ? (
            <ButtonLink href={pageHref} hierarchy="secondary" size="md" className="max-md:w-full">
              Open program page
            </ButtonLink>
          ) : null}
          {actionHref ? (
            <ButtonLink href={actionHref} hierarchy={hierarchy} size="md" aria-label={`${program.cta} ${program.title}`} className="max-md:w-full">
              {program.cta}
            </ButtonLink>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
