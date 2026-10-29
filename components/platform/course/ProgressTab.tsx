"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { ArrivalCountFrom } from "@/components/atoms/ArrivalCount";
import { useArrivalRing } from "@/lib/arrival/useArrival";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CertificateCard } from "@/components/platform/program/CertificatesTab";
import type { CourseDetail } from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";
import { CourseAlert } from "./CourseAlert";
import { WeeklyGoalCard } from "./WeeklyGoalCard";

/**
 * DS `LMS / Overall Progress` ring as the Completion card uses it: 92px, a 9.2px band
 * (innerRadius 0.8) on bg/muted with the arc on bg/info (icon/success-strong at 100%), square ends. The percentage has no
 * DS text style (36px line): headline-small/Semibold is the nearest class.
 */
function CompletionRing({ percent, label }: { percent: number; label: string }) {
  const radius = 41.4;
  const circumference = 2 * Math.PI * radius;
  // Sweeps from empty when it first shows on a first visit (motion-matrix §7.9).
  const ring = useArrivalRing<HTMLDivElement>(percent);
  return (
    <div ref={ring.ref} role="img" aria-label={`${label}: ${percent}%`} className="relative flex size-[92px] shrink-0 items-center justify-center">
      <svg className="size-[92px] -rotate-90" viewBox="0 0 92 92" aria-hidden>
        <circle cx="46" cy="46" r={radius} fill="none" stroke="var(--color-bg-muted)" strokeWidth="9.2" />
        <circle
          cx="46"
          cy="46"
          r={radius}
          fill="none"
          // Green at 100%, as every completed progress (Nelson, 27 Oct 2026; OverallProgress's colour).
          stroke={percent >= 100 ? "var(--color-icon-success-strong)" : "var(--color-bg-info)"}
          strokeWidth="9.2"
          strokeLinecap="butt"
          className={ring.transition}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (ring.shown / 100) * circumference}
        />
      </svg>
      <span aria-hidden className="sk-text-headline-small-semibold absolute text-sko-text-default">
        <ArrivalCountFrom value={`${percent}%`} trigger={ring.trigger} />
      </span>
    </div>
  );
}

export type GradeState = "not-started" | "below" | "passing" | "submitted" | "ended";

/** The DS Result of a grade, from the Grades API (`percent`, the pass mark) and the course dates. */
export function gradeState(grade: CourseDetail["progressTab"]["grade"]): GradeState {
  if (grade.percent >= grade.passPercent) return "passing";
  if (grade.courseEnded) return "ended";
  if (grade.allSubmitted) return "submitted";
  const scored = grade.sections.some((section) => section.items.some((item) => item.score !== null));
  return grade.percent === 0 && !scored ? "not-started" : "below";
}

function gradeSentence(state: GradeState, percent: number, pass: number): string {
  switch (state) {
    case "not-started":
      return `Your grade counts from your first graded activity. You need ${pass}% to pass.`;
    case "passing":
      return "You’re currently passing this course.";
    case "submitted":
      return `All graded activities are submitted. Your grade is below the ${pass}% pass mark.`;
    case "ended":
      return `This course has ended. Your final grade is below the ${pass}% pass mark.`;
    default:
      return `You need ${pass}% to pass. ${pass - percent}% to go.`;
  }
}

/** Percentage + sentence colour: amber only once all graded work is in, red only once the course ended. */
const GRADE_TONE: Record<GradeState, { percent: string; sentence: string }> = {
  "not-started": { percent: "text-sko-text-default", sentence: "text-sko-text-muted" },
  below: { percent: "text-sko-text-default", sentence: "text-sko-text-muted" },
  passing: { percent: "text-sko-text-success", sentence: "text-sko-text-muted" },
  submitted: { percent: "text-sko-text-warning", sentence: "text-sko-text-warning" },
  ended: { percent: "text-sko-text-error", sentence: "text-sko-text-error" },
};

const PASS_ICON: Record<GradeState, { icon: typeof AlertTriangle; className: string } | null> = {
  "not-started": null,
  below: { icon: AlertTriangle, className: "text-sko-icon-warning" },
  submitted: { icon: AlertTriangle, className: "text-sko-icon-warning" },
  passing: { icon: CheckCircle2, className: "text-sko-icon-success" },
  ended: { icon: XCircle, className: "text-sko-icon-error" },
};

/**
 * DS `LMS/ICP/Assessment/Grade-Summary` 1.1 (27 Oct 2026, Nelson): one card (bg/page,
 * border/subtle, radius 12, Elevation/level1; padding 24 / 20 / 16) with the title and the
 * percentage, a sentence that says where the learner stands, the grade bar with its pass mark,
 * the weights table and the graded items of each section.
 * Five Results, derived by `gradeState`: Not started, Below pass, Passing (green bar), Submitted below pass
 * (amber) and Course ended (the only red one). Open edX itself has no failed state: below the
 * pass mark is a warning in every release.
 * The current grade shows as a tooltip under the bar on hover only (Nelson, 27 Oct 2026): the
 * header already says it, so the tooltip is aria-hidden.
 * Item scores are neutral: a single item has no pass mark in Open edX. An item not submitted
 * reads "Not started" (`score: null`).
 * The table is a real <table>. On mobile the design keeps two columns, the weight and the
 * grade written into the first one ("Final Quiz · 50%, worth 30%"): the two middle columns
 * drop out and the same values join the row header.
 */
export function GradeSummary({ grade }: { grade: CourseDetail["progressTab"]["grade"] }) {
  const state = gradeState(grade);
  const tone = GRADE_TONE[state];
  const passIcon = PASS_ICON[state];
  const head = "px-0 py-2 text-right";
  const cell = "sk-text-body-medium-regular py-3 text-right align-top text-sko-text-muted";
  return (
    <section
      aria-labelledby="course-grade-title"
      className="flex flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-[15px] shadow-sm md:p-[19px] lg:p-[23px]"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 id="course-grade-title" className="sk-text-headline-small-bold text-sko-text-default">
            {grade.title}
          </h3>
          <p className={cn("sk-text-headline-small-bold", tone.percent)}>{grade.percent}%</p>
        </div>
        <p className={cn("sk-text-body-medium-regular", tone.sentence)}>
          {gradeSentence(state, grade.percent, grade.passPercent)}
        </p>
      </div>

      <div className="group relative flex flex-col gap-2">
        {/* Passing paints the grade bar green (Nelson, 29 Oct 2026); the sentence and the check
            icon at the pass mark say so too. Every other state keeps the bg/info fill. */}
        <PlatformProgressBar value={grade.percent} label={grade.title} tone={state === "passing" ? "complete" : undefined} />
        <span
          aria-hidden
          className="absolute top-0 h-2.5 w-0.5 -translate-x-1/2 bg-sko-bg-inverse"
          style={{ left: `${grade.passPercent}%` }}
        />
        {/* DS Progress bar Label=Bottom floating, shown on hover only. */}
        <span
          aria-hidden
          className="sk-text-body-small-medium pointer-events-none absolute top-4 z-10 -translate-x-1/2 rounded-control border border-sko-border-subtle bg-sko-bg-page px-2 py-1 text-sko-text-default opacity-0 shadow-sm transition-opacity duration-short3 ease-standard group-hover:opacity-100 motion-reduce:transition-none"
          style={{ left: `${Math.max(grade.percent, 4)}%` }}
        >
          {grade.percent}%
        </span>
        <div className="relative h-[18px]">
          <p
            className="sk-text-body-small-medium absolute top-0 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap text-sko-text-default"
            style={{ left: `${grade.passPercent}%` }}
          >
            {passIcon ? <Icon icon={passIcon.icon} size={14} aria-hidden className={passIcon.className} /> : null}
            {grade.passLabel}
          </p>
        </div>
      </div>

      <table className="w-full border-separate border-spacing-0 text-left md:table-fixed">
        <thead>
          {/* DS body-small/Bold: semibold until .sk-text-body-small-bold exists (CT-22). */}
          <tr className="sk-text-body-small-semibold h-9 text-sko-text-subtle">
            <th scope="col" className="rounded-l-control bg-sko-bg-subtle py-2 pl-3 pr-1 md:w-[170px] md:pl-4">
              {grade.columns.type}
            </th>
            <th scope="col" className={`${head} hidden bg-sko-bg-subtle md:table-cell`}>
              {grade.columns.weight}
            </th>
            <th scope="col" className={`${head} hidden bg-sko-bg-subtle md:table-cell`}>
              {grade.columns.grade}
            </th>
            <th scope="col" className="rounded-r-control bg-sko-bg-subtle py-2 pl-1 pr-2 text-right md:pr-3">
              {grade.columns.weighted}
            </th>
          </tr>
        </thead>
        <tbody>
          {grade.rows.map((row, index) => {
            // The DS rule is inside the row: the 1px comes off the top padding.
            const rule = index > 0 ? "border-t border-sko-border-subtle !pt-[11px]" : "";
            return (
              <tr key={row.type}>
                <th
                  scope="row"
                  className={`sk-text-body-medium-regular py-3 pl-3 pr-1 text-left align-top text-sko-text-default md:pl-4 ${rule}`}
                >
                  {row.type}
                  <span className="md:hidden">
                    {" "}
                    · {row.grade}, worth {row.weight}
                  </span>
                </th>
                <td className={`${cell} hidden md:table-cell ${rule}`}>{row.weight}</td>
                <td className={`${cell} hidden md:table-cell ${rule}`}>{row.grade}</td>
                {/* DS body-medium/Bold: semibold until .sk-text-body-medium-bold exists (CT-22). */}
                <td className={`sk-text-body-medium-semibold py-3 pl-1 pr-2 text-right align-top text-sko-text-muted md:pr-3 ${rule}`}>
                  {row.weighted}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex flex-col gap-1.5 pt-1">
        {grade.sections.map((section) => (
          <React.Fragment key={section.title}>
            <h4 className="sk-text-body-medium-semibold border-b border-sko-border-subtle pb-1 text-sko-text-default">
              {section.title}
            </h4>
            <ul className="flex flex-col gap-1.5">
              {section.items.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center justify-between gap-2 border-b border-sko-border-subtle pb-1"
                >
                  <span className="sk-text-body-medium-regular min-w-0 text-sko-text-default">{item.title}</span>
                  {item.score === null ? (
                    <span className="sk-text-body-medium-regular shrink-0 text-sko-text-subtle">Not started</span>
                  ) : (
                    // DS body-medium/Bold: semibold until .sk-text-body-medium-bold exists (CT-22).
                    <span className="sk-text-body-medium-semibold shrink-0 text-sko-text-default">{item.score}</span>
                  )}
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/**
 * DS `LMS/Platform/Course-Detail/Completion-Card` 1.3 (27 Oct 2026, Nelson): the count line
 * instead of a general sentence, a Gray badge for locked topics (only when there are any: they
 * are left out of the percentage), and Badge Success "Completed" beside the title at 100%.
 */
export function CompletionCard({ completion }: { completion: CourseDetail["progressTab"]["completion"] }) {
  const available = completion.complete + completion.incomplete;
  const percent = available ? Math.round((completion.complete / available) * 100) : 0;
  const done = available > 0 && completion.incomplete === 0;
  const line = done
    ? `All ${available} topics complete.`
    : `${completion.complete} of ${available} ${completion.locked ? "available " : ""}topics complete.`;
  return (
    <section
      aria-labelledby="course-completion-title"
      className="flex items-center gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-[15px] md:gap-5 md:p-[19px] lg:gap-6 lg:p-[23px]"
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 id="course-completion-title" className="sk-text-headline-small-bold text-sko-text-default">
            {completion.title}
          </h3>
          {done ? (
            <Badge color="success" size="sm">
              Completed
            </Badge>
          ) : null}
        </div>
        <p className="sk-text-body-large-regular text-sko-text-muted">{line}</p>
        {completion.locked ? (
          <Badge color="gray" size="sm">
            {completion.locked} locked {completion.locked === 1 ? "topic" : "topics"}
          </Badge>
        ) : null}
      </div>
      <CompletionRing percent={percent} label={completion.title} />
    </section>
  );
}

/**
 * Progress tab (desktop 6406:41528, tablet 6406:41969, mobile 6406:42331): the main column —
 * heading, Completion card, the passing-grade alert, the Grade summary and a closing line —
 * beside the Certificate and Weekly goal cards. The sidebar is 320 wide on desktop (40 apart,
 * main column 840 at 1280) and on tablet (32 apart), as on the Course tab; mobile stacks
 * everything, 16 apart. Until 10 Oct 2026 desktop split the row in two equal columns: Nelson
 * changed the desktop screen that day.
 *
 * A passed course (`course.passed`, a proposal of 10 Oct 2026) turns the alert to the success
 * tokens and has no Weekly goal card: the Certificate card stands alone. The Grade summary
 * finds its own state from the grade (`gradeState`).
 */
export function ProgressTab({ course }: { course: CourseDetail }) {
  const tab = course.progressTab;
  return (
    <div className="flex flex-col gap-layout-column md:flex-row md:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-layout-stack">
        <h2 className="sk-text-headline-medium-bold text-sko-text-default">{tab.title}</h2>

        <CompletionCard completion={tab.completion} />

        <CourseAlert tone={course.passed ? "success" : "warning"} title={tab.passAlert.title} body={tab.passAlert.body} />

        <GradeSummary grade={tab.grade} />

        <p className="sk-text-body-large-regular text-sko-text-muted">{tab.note}</p>
      </div>

      <aside aria-label={tab.weeklyGoal ? "Certificate and weekly goal" : "Certificate"} className="flex flex-col gap-4 md:w-[320px] md:shrink-0">
        <CertificateCard certificate={course.certificate} labelAs="h3" />
        {tab.weeklyGoal ? <WeeklyGoalCard goal={tab.weeklyGoal} courseSlug={course.slug} labelAs="h3" /> : null}
      </aside>
    </div>
  );
}
