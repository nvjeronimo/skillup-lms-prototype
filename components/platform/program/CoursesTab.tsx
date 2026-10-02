"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { useLmsStore } from "@/lib/store";
import { CONTENT_PENDING, type Program, type ProgramCourse } from "@/lib/platform/program";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./parts";

/** The row's `LMS / Course Detail / Meta` line: dot-separated facts. */
function courseMeta(course: ProgramCourse): string {
  if (course.state === "complete") return "Complete";
  if (course.state === "in-progress") {
    return typeof course.progress === "number" ? `In progress · ${course.progress}% complete` : "In progress";
  }
  return "Not started";
}

/** The course name without the "Course N · " prefix, for messages. */
function courseName(course: ProgramCourse): string {
  return course.title.replace(/^Course \d+ · /, "");
}

/**
 * DS `LMS / Course Detail / Module number` (5834:1527): a 32px circle with the position
 * (bg/primary-soft, body-medium/Semibold text/on-primary-soft), or a 16px check on
 * bg/success once the course is complete.
 */
function CourseNumber({ course }: { course: ProgramCourse }) {
  const complete = course.state === "complete";
  return (
    <span
      aria-hidden
      className={cn(
        "sk-text-sm-semibold flex size-8 shrink-0 items-center justify-center rounded-full",
        complete ? "bg-sko-bg-success text-sko-icon-on-success" : "bg-sko-bg-primary-soft text-sko-text-on-primary-soft",
      )}
    >
      {complete ? <Icon icon={Check} size={16} /> : course.number}
    </span>
  );
}

/**
 * DS `LMS / Program Detail / Course panel` (6444:3657): what an open course row shows — the
 * intro (body-medium/Regular, text/subtle), "Topics covered" (label-small/Semibold eyebrow +
 * a bulleted list of strings) and the progress + action row. In progress: bar + Primary
 * "Resume course"; Not started: Secondary "Start course"; Complete: bar at 100% + Secondary
 * "Review course". Below 640px the action drops under the bar at full width.
 */
function CoursePanel({ course }: { course: ProgramCourse }) {
  const showToast = useLmsStore((s) => s.showToast);
  const name = courseName(course);
  const notInPrototype = () => showToast(`${name} is not part of this prototype yet`);
  const hasBar = course.state !== "not-started";
  const progress = course.state === "complete" ? 100 : (course.progress ?? 0);

  return (
    <div className="flex flex-col gap-4 py-2">
      <p className="sk-text-sm-regular text-sko-text-subtle">{course.intro ?? CONTENT_PENDING}</p>

      {course.topics?.length ? (
        <div className="flex flex-col gap-1.5">
          <h4 className="sk-text-2xs-semibold text-sko-text-subtle">Topics covered</h4>
          <ul className="sk-text-sm-regular list-disc ps-[21px] text-sko-text-default">
            {course.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        {hasBar ? (
          <PlatformProgressBar
            value={progress}
            label={`${name}: course progress`}
            showValue
            className="min-w-0 flex-1"
          />
        ) : null}
        {course.state === "in-progress" && course.href ? (
          <ButtonLink href={course.href} aria-label={`Resume course: ${name}`} className="shrink-0">
            Resume course
          </ButtonLink>
        ) : (
          <Button
            hierarchy={course.state === "in-progress" ? "primary" : "secondary"}
            size="md"
            aria-label={`${actionLabel(course)}: ${name}`}
            onClick={notInPrototype}
            className="shrink-0"
          >
            {actionLabel(course)}
          </Button>
        )}
      </div>
    </div>
  );
}

function actionLabel(course: ProgramCourse): string {
  if (course.state === "complete") return "Review course";
  if (course.state === "not-started") return "Start course";
  return "Resume course";
}

/**
 * DS `LMS / Course Detail / Module row` (5416:382) used as a course row: one bordered card
 * (bg/page, border/subtle, radius 10) with the Header — Module number, title
 * (body-large/Semibold) over the Meta line (body-small/Regular, text/subtle), 20px chevron —
 * and, when open, the Topics slot (padding 4/20) holding the Course panel under a 1px rule.
 * The header is the accordion button inside the row's <h3>; the chevron turns when open.
 */
function CourseRow({
  course,
  open,
  onToggle,
}: {
  course: ProgramCourse;
  open: boolean;
  onToggle: () => void;
}) {
  const uid = React.useId();
  const buttonId = `${uid}-header`;
  const panelId = `${uid}-panel`;
  return (
    <li className="overflow-hidden rounded-[10px] border border-sko-border-subtle bg-sko-bg-page">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            // The DS stroke is inside the row and the CSS border is outside the padding: 15 + 1 = the DS 16 on desktop.
            "flex w-full items-center gap-3 p-4 text-left focus-visible:-outline-offset-2 lg:p-[15px]",
            open && "border-b border-sko-border-subtle",
          )}
        >
          <CourseNumber course={course} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="sk-text-md-semibold text-sko-text-default">{course.title}</span>
            <span className="sk-text-xs-regular text-sko-text-subtle">{courseMeta(course)}</span>
          </span>
          <Icon
            icon={ChevronDown}
            size={20}
            aria-hidden
            className={cn("shrink-0 text-sko-icon-faint transition-transform", open && "rotate-180")}
          />
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="px-5 py-1 lg:px-[19px]">
        <CoursePanel course={course} />
      </div>
    </li>
  );
}

/**
 * Courses tab (main column 6443:18735): the Section intro and the seven course rows, gap 12,
 * as an ordered list. Each row is an independent accordion; the in-progress course opens
 * with the page, as drawn.
 */
export function CoursesTab({ program }: { program: Program }) {
  const [open, setOpen] = React.useState<Set<string>>(
    () => new Set(program.courses.filter((c) => c.defaultOpen).map((c) => c.id)),
  );
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro title={program.coursesIntro.title} lead={program.coursesIntro.lead} />
      <ol
        data-mock="Course intro, topics and progress inside a program have no API"
        className="flex flex-col gap-3"
      >
        {program.courses.map((course) => (
          <CourseRow key={course.id} course={course} open={open.has(course.id)} onToggle={() => toggle(course.id)} />
        ))}
      </ol>
    </div>
  );
}
