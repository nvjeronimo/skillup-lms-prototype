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
import styles from "./ProgressTab.module.css";

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
    <div ref={ring.ref} role="img" aria-label={`${label}: ${percent}%`} className={styles.ring}>
      <svg className={styles.ringSvg} viewBox="0 0 92 92" aria-hidden>
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
      <span aria-hidden className={`sk-text-headline-small-semibold ${styles.ringValue}`}>
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
  "not-started": { percent: styles.textDefault, sentence: styles.textMuted },
  below: { percent: styles.textDefault, sentence: styles.textMuted },
  passing: { percent: styles.textSuccess, sentence: styles.textMuted },
  submitted: { percent: styles.textWarning, sentence: styles.textWarning },
  ended: { percent: styles.textError, sentence: styles.textError },
};

const PASS_ICON: Record<GradeState, { icon: typeof AlertTriangle; className: string } | null> = {
  "not-started": null,
  below: { icon: AlertTriangle, className: styles.iconWarning },
  submitted: { icon: AlertTriangle, className: styles.iconWarning },
  passing: { icon: CheckCircle2, className: styles.iconSuccess },
  ended: { icon: XCircle, className: styles.iconError },
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
  const head = styles.headCell;
  const cell = `sk-text-body-medium-regular ${styles.cell}`;
  return (
    <section
      aria-labelledby="course-grade-title"
      className={styles.grade}
    >
      <div className={styles.gradeHead}>
        <div className={styles.titleRow}>
          <h3 id="course-grade-title" className={`sk-text-headline-small-bold ${styles.textDefault}`}>
            {grade.title}
          </h3>
          <p className={cn("sk-text-headline-small-bold", tone.percent)}>{grade.percent}%</p>
        </div>
        <p className={cn("sk-text-body-medium-regular", tone.sentence)}>
          {gradeSentence(state, grade.percent, grade.passPercent)}
        </p>
      </div>

      <div className={styles.bar}>
        {/* Passing paints the grade bar green (Nelson, 29 Oct 2026); the sentence and the check
            icon at the pass mark say so too. Every other state keeps the bg/info fill. */}
        <PlatformProgressBar value={grade.percent} label={grade.title} tone={state === "passing" ? "complete" : undefined} />
        <span
          aria-hidden
          className={styles.passMark}
          style={{ left: `${grade.passPercent}%` }}
        />
        {/* DS Progress bar Label=Bottom floating, shown on hover only. */}
        <span
          aria-hidden
          className={`sk-text-body-small-medium ${styles.gradeTip}`}
          style={{ left: `${Math.max(grade.percent, 4)}%` }}
        >
          {grade.percent}%
        </span>
        <div className={styles.passLabelRow}>
          <p
            className={`sk-text-body-small-medium ${styles.passLabel}`}
            style={{ left: `${grade.passPercent}%` }}
          >
            {passIcon ? <Icon icon={passIcon.icon} size={14} aria-hidden className={passIcon.className} /> : null}
            {grade.passLabel}
          </p>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          {/* DS body-small/Bold: semibold until .sk-text-body-small-bold exists (CT-22). */}
          <tr className={`sk-text-body-small-semibold ${styles.headRow}`}>
            <th scope="col" className={styles.headType}>
              {grade.columns.type}
            </th>
            <th scope="col" className={`${head} ${styles.wideOnly}`}>
              {grade.columns.weight}
            </th>
            <th scope="col" className={`${head} ${styles.wideOnly}`}>
              {grade.columns.grade}
            </th>
            <th scope="col" className={styles.headWeighted}>
              {grade.columns.weighted}
            </th>
          </tr>
        </thead>
        <tbody>
          {grade.rows.map((row, index) => {
            // The DS rule is inside the row: the 1px comes off the top padding.
            const rule = index > 0 ? styles.rule : "";
            return (
              <tr key={row.type}>
                <th
                  scope="row"
                  className={`sk-text-body-medium-regular ${styles.rowType} ${rule}`}
                >
                  {row.type}
                  <span className={styles.phoneOnly}>
                    {" "}
                    · {row.grade}, worth {row.weight}
                  </span>
                </th>
                <td className={`${cell} ${styles.wideOnly} ${rule}`}>{row.weight}</td>
                <td className={`${cell} ${styles.wideOnly} ${rule}`}>{row.grade}</td>
                {/* DS body-medium/Bold: semibold until .sk-text-body-medium-bold exists (CT-22). */}
                <td className={`sk-text-body-medium-semibold ${styles.weighted} ${rule}`}>
                  {row.weighted}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.sections}>
        {grade.sections.map((section) => (
          <React.Fragment key={section.title}>
            <h4 className={`sk-text-body-medium-semibold ${styles.sectionTitle}`}>
              {section.title}
            </h4>
            <ul className={styles.items}>
              {section.items.map((item) => (
                <li
                  key={item.title}
                  className={styles.item}
                >
                  <span className={`sk-text-body-medium-regular ${styles.itemTitle}`}>{item.title}</span>
                  {item.score === null ? (
                    <span className={`sk-text-body-medium-regular ${styles.itemScore} ${styles.textSubtle}`}>Not started</span>
                  ) : (
                    // DS body-medium/Bold: semibold until .sk-text-body-medium-bold exists (CT-22).
                    <span className={`sk-text-body-medium-semibold ${styles.itemScore} ${styles.textDefault}`}>{item.score}</span>
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
      className={styles.completion}
    >
      <div className={styles.completionText}>
        <div className={styles.completionTitleRow}>
          <h3 id="course-completion-title" className={`sk-text-headline-small-bold ${styles.textDefault}`}>
            {completion.title}
          </h3>
          {done ? (
            <Badge color="success" size="sm">
              Completed
            </Badge>
          ) : null}
        </div>
        <p className={`sk-text-body-large-regular ${styles.textMuted}`}>{line}</p>
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
    <div className={styles.panel}>
      <div className={styles.main}>
        <h2 className={`sk-text-headline-medium-bold ${styles.textDefault}`}>{tab.title}</h2>

        <CompletionCard completion={tab.completion} />

        <CourseAlert tone={course.passed ? "success" : "warning"} title={tab.passAlert.title} body={tab.passAlert.body} />

        <GradeSummary grade={tab.grade} />

        <p className={`sk-text-body-large-regular ${styles.textMuted}`}>{tab.note}</p>
      </div>

      <aside aria-label={tab.weeklyGoal ? "Certificate and weekly goal" : "Certificate"} className={styles.aside}>
        <CertificateCard certificate={course.certificate} labelAs="h3" />
        {tab.weeklyGoal ? <WeeklyGoalCard goal={tab.weeklyGoal} courseSlug={course.slug} labelAs="h3" /> : null}
      </aside>
    </div>
  );
}
