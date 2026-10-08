"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MyLearningCourseCard } from "@/components/platform/my-learning/MyLearningCourseCard";
import { useLmsStore } from "@/lib/store";
import { CONTENT_PENDING, type Program, type ProgramCourse, type ProgramModule } from "@/lib/platform/program";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./parts";

/**
 * DS `LMS/Platform/Course-Detail/Module-Number`: a 32px circle with the position
 * (bg/primary-soft, body-medium/Semibold text/on-primary-soft), or a 16px check on
 * bg/success once the module is complete.
 */
function ModuleNumber({ module }: { module: ProgramModule }) {
  return (
    <span
      aria-hidden
      className={cn(
        "sk-text-body-medium-semibold flex size-8 shrink-0 items-center justify-center rounded-full",
        module.complete ? "bg-sko-bg-success text-sko-icon-on-success" : "bg-sko-bg-primary-soft text-sko-text-on-primary-soft",
      )}
    >
      {module.complete ? <Icon icon={Check} size={16} /> : module.number}
    </span>
  );
}

/**
 * DS `LMS/Platform/Course-Detail/Module-Row`, collapsed and without a chevron, as the course
 * row lists it: bg/page, 1px border/subtle (inside), radius 10, padding 16, gap 12: the
 * Module number, the title (body-large/Semibold) over the Meta line (body-small/Regular,
 * text/subtle: topics · duration), and the empty 20px trailing slot the DS row keeps.
 * 76 tall with a one-line title.
 */
function ModuleRow({ module }: { module: ProgramModule }) {
  return (
    <li
      // The current module sits in a wrapper with 4 above it in the DS row (where the
      // "You left off here" badge was until 7 Oct); kept so the open row is as tall as drawn.
      className={cn(module.current && "pt-1")}
    >
      <div className="flex items-center gap-3 rounded-[10px] border border-sko-border-subtle bg-sko-bg-page p-[15px]">
        <ModuleNumber module={module} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="sk-text-body-large-semibold text-sko-text-default">
            {module.title}
            {module.complete ? <span className="sr-only"> (complete)</span> : null}
          </p>
          <p className="sk-text-body-small-regular text-sko-text-subtle">
            {module.topics} <span aria-hidden>·</span> {module.duration}
          </p>
        </div>
        <span aria-hidden className="size-5 shrink-0" />
      </div>
    </li>
  );
}

/* DS Toggle: Buttons/Button sm · Link gray with chevron-down / chevron-up: body-medium/Semibold
   in text/subtle, 4 gap, 20 icon, radius 4, no underline (the same control as the section
   header's action). 20px tall as drawn; the target is 44px and the negative margin keeps the
   bar at its drawn height. */
const TOGGLE =
  "sk-text-body-medium-semibold -my-3 inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded text-sko-text-subtle transition-colors hover:text-sko-text-default";

/**
 * DS `LMS/Platform/Program-Detail/Course-Row` (`Breakpoint` Desktop · Compact, `Expanded`):
 * one course of the program. bg/page, 1px border/subtle, radius 12, Shadows/shadow-card.
 * - The DS `LMS / Course Card`, bare (the row draws the border and the shadow): Layout=List
 *   on desktop (1198 × 136 with a two-line title), Layout=Grid below it with the action at
 *   full width (Compact). Every action in the list is Secondary: the page's primary action
 *   is "Resume course" in the header.
 * - The modules bar, under a 1px rule, padding 12 / 16: `Position` (body-medium/Semibold)
 *   and `Detail` (body-medium/Regular, text/subtle) 8 apart, and the Show / Hide toggle. On
 *   mobile the detail drops under the position (2 apart); nothing is cut or hidden.
 * - Expanded: the modules on bg/faint under a 1px rule, padding 16, gap 8.
 * Closed 1200 × 183 on desktop, 912 × 383 on tablet, 343 × 435 on mobile.
 */
function CourseRow({ course, open, onToggle }: { course: ProgramCourse; open: boolean; onToggle: () => void }) {
  const showToast = useLmsStore((s) => s.showToast);
  const uid = React.useId();
  const panelId = `${uid}-modules`;
  const title = course.card.title;
  const notInPrototype = () => showToast(`${title} is not part of this prototype yet`);

  return (
    <li className="overflow-hidden rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card">
      <MyLearningCourseCard
        course={course.card}
        layout="list"
        context="row"
        onAction={notInPrototype}
        className="hidden lg:flex"
      />
      <MyLearningCourseCard
        course={course.card}
        layout="grid"
        context="row"
        emphasis="secondary"
        onAction={notInPrototype}
        className="lg:hidden"
      />

      {/* No gap between the two: in the DS bar the texts fill the width left of the toggle. */}
      <div className="flex items-center justify-between border-t border-sko-border-subtle px-4 py-3">
        <p className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="sk-text-body-medium-semibold text-sko-text-default">{course.position}</span>
          <span className="sk-text-body-medium-regular text-sko-text-subtle max-md:w-full md:min-w-0 md:flex-1">
            {course.detail}
          </span>
        </p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? "Hide" : "Show"} modules: ${title}`}
          onClick={onToggle}
          className={TOGGLE}
        >
          {open ? "Hide" : "Show"}
          <Icon icon={open ? ChevronUp : ChevronDown} size={20} className="text-sko-icon-subtle" aria-hidden />
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-label={`Modules of ${title}`}
        hidden={!open}
        className="border-t border-sko-border-subtle bg-sko-bg-faint p-4"
      >
        {course.modules?.length ? (
          <ol
            data-mock="Module durations are not authored yet (effort_time)"
            className="flex flex-col gap-2"
          >
            {course.modules.map((module) => (
              <ModuleRow key={module.number} module={module} />
            ))}
          </ol>
        ) : (
          <p className="sk-text-body-medium-regular text-sko-text-subtle">{CONTENT_PENDING}</p>
        )}
      </div>
    </li>
  );
}

/**
 * Courses tab (handoff cards 01–03 of 6728:15050): the Section intro and the seven course
 * rows, 16 apart, as an ordered list in one full-width column (this tab has no sidebar: the
 * List card needs the width). Each row opens on its own; the course in progress opens with
 * the page, as drawn.
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
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      <SectionIntro title={program.coursesIntro.title} lead={program.coursesIntro.lead} />
      <ol className="flex flex-col gap-4">
        {program.courses.map((course) => (
          <CourseRow key={course.id} course={course} open={open.has(course.id)} onToggle={() => toggle(course.id)} />
        ))}
      </ol>
    </div>
  );
}
