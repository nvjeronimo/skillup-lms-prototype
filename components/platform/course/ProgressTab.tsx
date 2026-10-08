"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CertificateCard } from "@/components/platform/program/CertificatesTab";
import type { CourseDetail } from "@/lib/platform/course-detail";
import { CourseAlert } from "./CourseAlert";
import { WeeklyGoalCard } from "./WeeklyGoalCard";

/**
 * DS `LMS / Overall Progress` ring as the Completion card uses it: 92px, a 9.2px band
 * (innerRadius 0.8) on bg/muted with the arc on bg/info, square ends. The percentage has no
 * DS text style (36px line): headline-small/Semibold is the nearest class.
 */
function CompletionRing({ percent, label }: { percent: number; label: string }) {
  const radius = 41.4;
  const circumference = 2 * Math.PI * radius;
  return (
    <div role="img" aria-label={`${label}: ${percent}%`} className="relative flex size-[92px] shrink-0 items-center justify-center">
      <svg className="size-[92px] -rotate-90" viewBox="0 0 92 92" aria-hidden>
        <circle cx="46" cy="46" r={radius} fill="none" stroke="var(--color-bg-muted)" strokeWidth="9.2" />
        <circle
          cx="46"
          cy="46"
          r={radius}
          fill="none"
          stroke="var(--color-bg-info)"
          strokeWidth="9.2"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percent / 100) * circumference}
        />
      </svg>
      <span aria-hidden className="sk-text-headline-small-semibold absolute text-sko-text-default">
        {percent}%
      </span>
    </div>
  );
}

/**
 * DS `LMS / Quiz · Grade Summary`, Result=Below pass (6406:41528): one card (bg/page,
 * border/subtle, radius 12, Elevation/level1; padding 24 / 20 / 16) with the title and the
 * verdict badge, the grade bar with its 70% pass mark, the weights table and the breakdown
 * of the graded sections.
 * The table is a real <table>. On mobile the design keeps two columns, the weight and the
 * grade written into the first one ("Final Quiz · 50%, worth 30%"): the two middle columns
 * drop out and the same values join the row header.
 */
function GradeSummary({ grade }: { grade: CourseDetail["progressTab"]["grade"] }) {
  const head = "px-0 py-2 text-right";
  const cell = "sk-text-body-medium-regular py-3 text-right align-top text-sko-text-muted";
  return (
    <section
      aria-labelledby="course-grade-title"
      className="flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-[15px] shadow-sm md:p-[19px] lg:p-[23px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h3 id="course-grade-title" className="sk-text-headline-small-bold text-sko-text-default">
          {grade.title}
        </h3>
        <Badge color="error" size="md">
          {grade.badge}
        </Badge>
      </div>

      <div className="relative flex flex-col gap-2">
        <PlatformProgressBar value={grade.percent} label={grade.title} />
        <span
          aria-hidden
          className="absolute top-0 h-2.5 w-0.5 -translate-x-1/2 bg-sko-bg-inverse"
          style={{ left: `${grade.passPercent}%` }}
        />
        <div className="relative h-[18px]">
          <p className="sk-text-body-small-regular absolute left-0 top-0 text-sko-text-subtle">{grade.currentLabel}</p>
          <p
            className="sk-text-body-small-medium absolute top-0 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap text-sko-text-default"
            style={{ left: `${grade.passPercent}%` }}
          >
            <Icon icon={AlertTriangle} size={14} aria-hidden className="text-sko-icon-warning" />
            {grade.passLabel}
          </p>
        </div>
      </div>

      <table className="w-full border-separate border-spacing-0 text-left md:table-fixed">
        <thead>
          {/* DS body-small/Bold: semibold until .sk-text-body-small-bold exists (CT-22). */}
          <tr className="sk-text-body-small-semibold h-9 text-sko-text-subtle">
            <th scope="col" className="rounded-l-lg bg-sko-bg-subtle py-2 pl-3 pr-1 md:w-[170px] md:pl-4">
              {grade.columns.type}
            </th>
            <th scope="col" className={`${head} hidden bg-sko-bg-subtle md:table-cell`}>
              {grade.columns.weight}
            </th>
            <th scope="col" className={`${head} hidden bg-sko-bg-subtle md:table-cell`}>
              {grade.columns.grade}
            </th>
            <th scope="col" className="rounded-r-lg bg-sko-bg-subtle py-2 pl-1 pr-2 text-right md:pr-3">
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
                  {/* DS body-medium/Bold: semibold until .sk-text-body-medium-bold exists (CT-22). */}
                  <span className="sk-text-body-medium-semibold shrink-0 text-sko-text-error">{item.score}</span>
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
 * Progress tab (desktop 6406:41528, tablet 6406:41969, mobile 6406:42331): the main column —
 * heading, Completion card, the passing-grade alert, the Grade summary and a closing line —
 * beside the Certificate and Weekly goal cards. Desktop splits the row in two equal columns,
 * 40 apart; tablet keeps the sidebar at 320, 32 apart; mobile stacks everything, 16 apart.
 */
export function ProgressTab({ course }: { course: CourseDetail }) {
  const tab = course.progressTab;
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8 lg:gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5 lg:gap-6">
        <h2 className="sk-text-headline-medium-bold text-sko-text-default">{tab.title}</h2>

        <section
          aria-labelledby="course-completion-title"
          className="flex items-center gap-4 rounded-[10px] border border-sko-border-subtle bg-sko-bg-page p-[15px] md:gap-5 md:p-[19px] lg:gap-6 lg:p-[23px]"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h3 id="course-completion-title" className="sk-text-headline-small-bold text-sko-text-default">
              {tab.completion.title}
            </h3>
            <p className="sk-text-body-large-regular text-sko-text-muted">{tab.completion.body}</p>
            <p className="sk-text-body-large-medium text-sko-text-muted">{tab.completion.counts}</p>
          </div>
          <CompletionRing percent={tab.completion.percent} label={tab.completion.title} />
        </section>

        <CourseAlert tone="warning" title={tab.passAlert.title} body={tab.passAlert.body} />

        <GradeSummary grade={tab.grade} />

        <p className="sk-text-body-large-regular text-sko-text-muted">{tab.note}</p>
      </div>

      <aside aria-label="Certificate and weekly goal" className="flex flex-col gap-4 md:w-[320px] md:shrink-0 lg:w-auto lg:flex-1 lg:shrink">
        <CertificateCard certificate={course.certificate} labelAs="h3" />
        <WeeklyGoalCard goal={tab.weeklyGoal} labelAs="h3" />
      </aside>
    </div>
  );
}
