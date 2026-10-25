"use client";

import * as React from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { Icon, topicTypeIcon } from "@/lib/icons";
import type { DashboardResumeRow } from "@/lib/platform/dashboard-resume";
import { cn } from "@/lib/utils";

/**
 * Harbor's "Pick up where you left off" (Nelson, 25 Oct 2026, after the DreamHost panel's home):
 * a list on the left (each course a white, hairlined card: its title and where it stopped) and
 * the chosen one large on the right, on a pale panel: the picture, the module, the next topic,
 * the progress and Resume. The list is a set of toggle buttons (aria-pressed) that drive the
 * panel, which is announced politely. Below desktop the list stacks above the panel.
 */
export function HarborPickUp({ resume, titleId }: { resume: DashboardResumeRow[]; titleId: string }) {
  const [current, setCurrent] = React.useState(0);
  const course = resume[current] ?? resume[0];
  if (!course) return null;
  const NextIcon = course.next ? topicTypeIcon(course.next.type) : null;
  return (
    <div className="grid gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-2 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
      <ul aria-labelledby={titleId} className="flex flex-col gap-2">
        {resume.map((c, i) => {
          const on = i === current;
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setCurrent(i)}
                className={cn(
                  "flex min-h-16 w-full flex-col items-start justify-center gap-0.5 rounded-inner px-4 py-3 text-left transition-colors",
                  on
                    ? "bg-sko-bg-primary-soft text-sko-text-on-primary-soft"
                    : "bg-sko-bg-subtle text-sko-text-default hover:bg-sko-bg-hover",
                )}
              >
                <span className="sk-text-body-medium-semibold line-clamp-2">{c.title}</span>
                <span className="sk-text-body-small-regular text-sko-text-subtle">{c.progressPct}% complete</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div aria-live="polite" className="flex min-w-0 flex-col gap-4 rounded-inner bg-sko-bg-subtle p-5 md:p-6">
        <CourseThumb
          shape="cover"
          initials={course.initials}
          imageSrc={course.imageSrc}
          className="aspect-[3/1] w-full rounded-inner"
        />
        <Link
          href={course.homeHref}
          className="sk-text-title-large-semibold text-sko-text-default underline-offset-2 hover:underline"
        >
          {course.headline}
        </Link>
        {course.context ? (
          <p className="sk-text-body-medium-regular max-w-[56ch] text-sko-text-muted">{course.context}</p>
        ) : null}
        {course.next && NextIcon ? (
          <p className="sk-text-body-medium-medium inline-flex items-center gap-2 text-sko-text-muted">
            <Icon icon={NextIcon} size={16} className="text-sko-icon-primary" aria-hidden />
            Next: {course.next.type}
            {course.next.duration ? ` · ${course.next.duration}` : ""}
          </p>
        ) : null}
        <div className="flex items-center gap-3">
          <PlatformProgressBar value={course.progressPct} label={`${course.title} progress`} className="flex-1" />
          <span className="sk-text-body-medium-semibold text-sko-text-default">{course.progressPct}%</span>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-3">
          <ButtonLink href={course.href} hierarchy="primary" size="md">
            Resume
          </ButtonLink>
          <ButtonLink href={course.homeHref} hierarchy="secondary" size="md">
            View course
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
