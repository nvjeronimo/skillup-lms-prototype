import * as React from "react";
import Link from "@/lib/router";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { Button } from "@/components/atoms/Button";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { MyLearningCourse, MyLearningProgram } from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";
import styles from "./HarborCourseTable.module.css";

/**
 * Harbor's table view of My Learning (Nelson, 25 Oct 2026, after the DreamHost panel's Websites
 * list): one row per course, the columns a learner with many courses scans: the course (picture,
 * title linking to its page, provider, then level and delivery as words), progress, what is next, the effort, and the action as the
 * panel's white "Manage" button. A real table (caption, column headers); on a tablet
 * (below lg) Up next and Effort sit under the progress bar so the action stays in view. Columns sit 32 apart (pr-8 on every cell but the last; Nelson, 29 Oct 2026).
 */
export function HarborCourseTable({
  courses,
  onAction,
}: {
  courses: MyLearningCourse[];
  onAction: (course: MyLearningCourse) => void;
}) {
  return (
    <div className={styles.frame}>
      <table className={styles.table}>
        <caption className="sk-sr-only">Your courses</caption>
        <thead>
          <tr className={styles.headRow}>
            <th scope="col" className={cn(styles.colHead, "sk-text-body-small-semibold")}>Course</th>
            <th scope="col" className={cn(styles.colHead, "sk-text-body-small-semibold", styles.colProgress)}>Progress</th>
            <th scope="col" className={cn(styles.colHead, styles.desktopOnly, "sk-text-body-small-semibold")}>Up next</th>
            <th scope="col" className={cn(styles.colHead, styles.desktopOnly, styles.colEffort, "sk-text-body-small-semibold")}>Effort</th>
            <th scope="col" className={cn(styles.colHeadLast, "sk-text-body-small-semibold", styles.colAction)}>
              <span className="sk-sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => {
            const pct = c.progressPct;
            // A completed course reads "Certificate issued …", as the Programs table (Nelson, 28 Oct 2026).
            const next = "certificate" in c.upNext ? c.upNext.certificate.replace(/^Issued /, "Certificate issued ") : c.upNext.title;
            return (
              <tr key={c.id} className={styles.row}>
                <th scope="row" className={cn("sk-text-body-medium-regular", styles.cell)}>
                  <span className={styles.item}>
                    {/* Square, 48 (Nelson, 26 Oct 2026): a table row is one line of type high. */}
                    <CourseThumb
                      shape="tile"
                      initials={c.initials}
                      imageSrc={c.imageSrc}
                      className={styles.thumb}
                    />
                    <span className={styles.itemText}>
                      {c.detailHref ? (
                        <Link href={c.detailHref} className={cn("sk-text-body-large-medium", styles.titleLink)}>
                          {c.title}
                        </Link>
                      ) : (
                        <span className={cn("sk-text-body-large-medium", styles.title)}>{c.title}</span>
                      )}
                      {/* Level and delivery as plain words after the provider (Nelson, 27 Oct 2026). */}
                      <span className={cn("sk-text-body-small-medium", styles.meta)}>
                        <span className={styles.provider}>{c.provider}</span> · {c.difficulty} · {c.delivery}
                      </span>
                    </span>
                  </span>
                </th>
                <td className={styles.cell}>
                  <span className={styles.progressStack}>
                    {pct === null ? (
                      <span className={cn("sk-text-body-medium-regular", styles.notStarted)}>Not started</span>
                    ) : (
                      <span className={styles.progressRow}>
                        <PlatformProgressBar
                          value={pct}
                          tone={pct >= 100 ? "complete" : "progress"}
                          label={`${c.title} progress`}
                          className={styles.bar}
                        />
                        <span className={cn("sk-text-body-medium-semibold", styles.pct)}>{pct}%</span>
                      </span>
                    )}
                    {/* On a tablet Up next and Effort move under the bar, so the row fits without
                        scrolling the action out of view (Nelson, 3 Nov 2026). */}
                    <span className={cn("sk-text-body-small-regular", styles.note, styles.tabletOnly)}>{next}</span>
                    <span className={cn("sk-text-body-small-regular", styles.note, styles.tabletOnly)}>{c.progressMeta}</span>
                  </span>
                </td>
                <td className={cn("sk-text-body-medium-regular", styles.cell, styles.desktopOnly, styles.cellMuted)}>{next}</td>
                <td className={cn("sk-text-body-medium-regular", styles.cell, styles.desktopOnly, styles.cellMuted)}>{c.progressMeta}</td>
                <td className={styles.actionCell}>
                  {c.href ? (
                    <ButtonLink href={c.href} hierarchy="secondary" size="sm" aria-label={`${c.cta} ${c.title}`}>
                      {c.cta}
                    </ButtonLink>
                  ) : (
                    <Button hierarchy="secondary" size="sm" onClick={() => onAction(c)} aria-label={`${c.cta} ${c.title}`}>
                      {c.cta}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * The same table for the Programs tab (Nelson, 26 Oct 2026): the program (picture, title linking
 * to its page, partners, then level and delivery as words), progress with how many courses are complete under the bar (one column
 * since 29 Oct 2026, Nelson: more room for the title and Up next), what is next (the course in progress, the start date, or the
 * certificate), and the action.
 */
export function HarborProgramTable({
  programs,
  onAction,
}: {
  programs: MyLearningProgram[];
  onAction: (program: MyLearningProgram) => void;
}) {
  return (
    <div className={styles.frame}>
      <table className={styles.table}>
        <caption className="sk-sr-only">Your programs</caption>
        <thead>
          <tr className={styles.headRow}>
            <th scope="col" className={cn(styles.colHead, "sk-text-body-small-semibold")}>Program</th>
            <th scope="col" className={cn(styles.colHead, "sk-text-body-small-semibold", styles.colProgress, styles.colProgressWide)}>Progress</th>
            <th scope="col" className={cn(styles.colHead, styles.desktopOnly, "sk-text-body-small-semibold")}>Up next</th>
            <th scope="col" className={cn(styles.colHeadLast, "sk-text-body-small-semibold", styles.colActionWide)}>
              <span className="sk-sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {programs.map((p) => {
            const next = p.upNext ?? p.status ?? (p.certificateDate ? `Certificate issued ${p.certificateDate}` : "");
            const actionHref = p.actionHref ?? (p.cta === "View certificate" ? p.href : undefined);
            return (
              <tr key={p.id} className={styles.row}>
                <th scope="row" className={cn("sk-text-body-medium-regular", styles.cell)}>
                  <span className={styles.item}>
                    <CourseThumb
                      shape="tile"
                      initials={p.initials}
                      imageSrc={p.imageSrc}
                      className={styles.thumb}
                    />
                    <span className={styles.itemText}>
                      {p.href ? (
                        <Link href={p.href} className={cn("sk-text-body-large-medium", styles.titleLink)}>
                          {p.title}
                        </Link>
                      ) : (
                        <span className={cn("sk-text-body-large-medium", styles.title)}>{p.title}</span>
                      )}
                      {/* Level and delivery as plain words after the partners (Nelson, 27 Oct 2026). */}
                      <span className={cn("sk-text-body-small-medium", styles.meta)}>
                        <span className={styles.provider}>{p.partners.map((partner) => partner.name).join(" · ")}</span> ·{" "}
                        {p.difficulty} · {p.delivery}
                      </span>
                    </span>
                  </span>
                </th>
                <td className={styles.cell}>
                  <span className={styles.progressStack}>
                    {p.progressPct ? (
                      <span className={styles.progressRow}>
                        <PlatformProgressBar
                          value={p.progressPct}
                          tone={p.progressPct >= 100 ? "complete" : "progress"}
                          label={`${p.title} progress`}
                          className={styles.bar}
                        />
                        <span className={cn("sk-text-body-medium-semibold", styles.pct)}>{p.progressPct}%</span>
                      </span>
                    ) : (
                      <span className={cn("sk-text-body-medium-regular", styles.notStarted)}>Not started</span>
                    )}
                    <span className={cn("sk-text-body-small-regular", styles.note)}>{p.courses}</span>
                    {/* Up next under the bar on a tablet (Nelson, 3 Nov 2026), as the Courses table. */}
                    {next ? <span className={cn("sk-text-body-small-regular", styles.note, styles.tabletOnly)}>{next}</span> : null}
                  </span>
                </td>
                <td className={cn("sk-text-body-medium-regular", styles.cell, styles.desktopOnly, styles.cellMuted)}>{next}</td>
                <td className={styles.actionCell}>
                  {actionHref ? (
                    <ButtonLink href={actionHref} hierarchy="secondary" size="sm" aria-label={`${p.cta} ${p.title}`}>
                      {p.cta}
                    </ButtonLink>
                  ) : (
                    <Button hierarchy="secondary" size="sm" onClick={() => onAction(p)} aria-label={`${p.cta} ${p.title}`}>
                      {p.cta}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
