"use client";

import * as React from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { Button } from "@/components/atoms/Button";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { MyLearningCourse, MyLearningProgram } from "@/lib/platform/my-learning";

/**
 * Harbor's table view of My Learning (Nelson, 25 Oct 2026, after the DreamHost panel's Websites
 * list): one row per course, the columns a learner with many courses scans: the course (picture,
 * title linking to its page, provider, then level and delivery as words), progress, what is next, the effort, and the action as the
 * panel's white "Manage" button. A real table (caption, column headers), from desktop up; below,
 * My Learning shows its grid.
 */
export function HarborCourseTable({
  courses,
  onAction,
}: {
  courses: MyLearningCourse[];
  onAction: (course: MyLearningCourse) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-sko-border-subtle bg-sko-bg-page px-4 pb-1.5">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <caption className="sr-only">Your courses</caption>
        <thead>
          <tr className="text-sko-text-default">
            <th scope="col" className="py-4 pr-4 sk-text-body-small-semibold">Course</th>
            <th scope="col" className="w-[200px] py-4 pr-4 sk-text-body-small-semibold">Progress</th>
            <th scope="col" className="py-4 pr-4 sk-text-body-small-semibold">Up next</th>
            <th scope="col" className="w-[140px] py-4 pr-4 sk-text-body-small-semibold">Effort</th>
            <th scope="col" className="w-[120px] py-4 sk-text-body-small-semibold">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => {
            const pct = c.progressPct;
            // A completed course reads "Certificate issued …", as the Programs table (Nelson, 28 Oct 2026).
            const next = "certificate" in c.upNext ? c.upNext.certificate.replace(/^Issued /, "Certificate issued ") : c.upNext.title;
            return (
              <tr key={c.id} className="border-t border-sko-border-subtle">
                <th scope="row" className="sk-text-body-medium-regular py-3 pr-4">
                  <span className="flex items-center gap-3">
                    {/* Square, 48 (Nelson, 26 Oct 2026): a table row is one line of type high. */}
                    <CourseThumb
                      shape="tile"
                      initials={c.initials}
                      imageSrc={c.imageSrc}
                      className="size-12 shrink-0 rounded-inner"
                    />
                    <span className="flex min-w-0 flex-col">
                      {c.detailHref ? (
                        <Link href={c.detailHref} className="sk-text-body-large-medium text-sko-text-default underline-offset-2 hover:underline">
                          {c.title}
                        </Link>
                      ) : (
                        <span className="sk-text-body-large-medium text-sko-text-default">{c.title}</span>
                      )}
                      {/* Level and delivery as plain words after the provider (Nelson, 27 Oct 2026). */}
                      <span className="sk-text-body-small-medium text-sko-text-subtle">
                        <span className="text-sko-text-primary">{c.provider}</span> · {c.difficulty} · {c.delivery}
                      </span>
                    </span>
                  </span>
                </th>
                <td className="py-3 pr-4">
                  {pct === null ? (
                    <span className="sk-text-body-medium-regular text-sko-text-subtle">Not started</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <PlatformProgressBar
                        value={pct}
                        tone={pct >= 100 ? "complete" : "progress"}
                        label={`${c.title} progress`}
                        className="flex-1"
                      />
                      <span className="sk-text-body-medium-semibold w-10 text-right text-sko-text-default">{pct}%</span>
                    </span>
                  )}
                </td>
                <td className="sk-text-body-medium-regular py-3 pr-4 text-sko-text-muted">{next}</td>
                <td className="sk-text-body-medium-regular py-3 pr-4 text-sko-text-muted">{c.progressMeta}</td>
                <td className="py-3 text-right">
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
    <div className="overflow-x-auto rounded-card border border-sko-border-subtle bg-sko-bg-page px-4 pb-1.5">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <caption className="sr-only">Your programs</caption>
        <thead>
          <tr className="text-sko-text-default">
            <th scope="col" className="py-4 pr-4 sk-text-body-small-semibold">Program</th>
            <th scope="col" className="w-[220px] py-4 pr-4 sk-text-body-small-semibold">Progress</th>
            <th scope="col" className="py-4 pr-4 sk-text-body-small-semibold">Up next</th>
            <th scope="col" className="w-[160px] py-4 sk-text-body-small-semibold">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {programs.map((p) => {
            const next = p.upNext ?? p.status ?? (p.certificateDate ? `Certificate issued ${p.certificateDate}` : "");
            const actionHref = p.actionHref ?? (p.cta === "View Certificate" ? p.href : undefined);
            return (
              <tr key={p.id} className="border-t border-sko-border-subtle">
                <th scope="row" className="sk-text-body-medium-regular py-3 pr-4">
                  <span className="flex items-center gap-3">
                    <CourseThumb
                      shape="tile"
                      initials={p.initials}
                      imageSrc={p.imageSrc}
                      className="size-12 shrink-0 rounded-inner"
                    />
                    <span className="flex min-w-0 flex-col">
                      {p.href ? (
                        <Link href={p.href} className="sk-text-body-large-medium text-sko-text-default underline-offset-2 hover:underline">
                          {p.title}
                        </Link>
                      ) : (
                        <span className="sk-text-body-large-medium text-sko-text-default">{p.title}</span>
                      )}
                      {/* Level and delivery as plain words after the partners (Nelson, 27 Oct 2026). */}
                      <span className="sk-text-body-small-medium text-sko-text-subtle">
                        <span className="text-sko-text-primary">{p.partners.map((partner) => partner.name).join(" · ")}</span> ·{" "}
                        {p.difficulty} · {p.delivery}
                      </span>
                    </span>
                  </span>
                </th>
                <td className="py-3 pr-4">
                  <span className="flex flex-col gap-1">
                    {p.progressPct ? (
                      <span className="flex items-center gap-2">
                        <PlatformProgressBar
                          value={p.progressPct}
                          tone={p.progressPct >= 100 ? "complete" : "progress"}
                          label={`${p.title} progress`}
                          className="flex-1"
                        />
                        <span className="sk-text-body-medium-semibold w-10 text-right text-sko-text-default">{p.progressPct}%</span>
                      </span>
                    ) : (
                      <span className="sk-text-body-medium-regular text-sko-text-subtle">Not started</span>
                    )}
                    <span className="sk-text-body-small-regular text-sko-text-muted">{p.courses}</span>
                  </span>
                </td>
                <td className="sk-text-body-medium-regular py-3 pr-4 text-sko-text-muted">{next}</td>
                <td className="py-3 text-right">
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
