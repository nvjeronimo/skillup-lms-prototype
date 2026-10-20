"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MyLearningCourseCard } from "@/components/platform/my-learning/MyLearningCourseCard";
import { useLmsStore } from "@/lib/store";
import type { MyLearningCourse } from "@/lib/platform/my-learning";
import { CONTENT_PENDING, type ProgramCourse, type ProgramModule } from "@/lib/platform/program";
import { cn } from "@/lib/utils";

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
        "sk-text-body-medium-semibold flex size-8 shrink-0 items-center justify-center rounded-pill",
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
      <div className="flex items-center gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-[15px]">
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
  "sk-text-body-medium-semibold -my-3 inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-control text-sko-text-subtle transition-colors hover:text-sko-text-default";

export interface CourseRowCardProps extends Pick<ProgramCourse, "position" | "detail" | "modules"> {
  /** What the DS `LMS / Course Card` on top shows. */
  card: MyLearningCourse;
  open: boolean;
  onToggle: () => void;
  /**
   * DS `Breakpoint`. `responsive` (the Program page) is Desktop from lg up and Compact below.
   * `desktop` and `compact` fix it, for a page that picks the row by its view: the list and
   * the grid of My Learning.
   */
  breakpoint?: "responsive" | "desktop" | "compact";
  className?: string;
  /** On the row itself: a list that staggers its rows sets the entrance delay here. */
  style?: React.CSSProperties;
}

/**
 * DS `LMS/Platform/Program-Detail/Course-Row` (`Breakpoint` Desktop · Compact, `Expanded`):
 * one course with its modules. bg/page, 1px border/subtle, radius 12, Shadows/shadow-card.
 * Shared by the Program page and, since 11 Oct 2026, by My Learning › Courses (decided by
 * Nelson: wherever the course card stood on its own, it is this row).
 * - The DS `LMS / Course Card`, bare (the row draws the border and the shadow): Layout=List
 *   on desktop (1198 × 136 with a two-line title), Layout=Grid below it with the action at
 *   full width (Compact). Every action in the list is Secondary: the page's primary action
 *   is "Resume course" in the header.
 * - The modules bar, under a 1px rule, padding 12 / 16: `Position` (body-medium/Semibold)
 *   and `Detail` (body-medium/Regular, text/subtle) 8 apart, and the Show / Hide toggle. On
 *   mobile, and in a row fixed at Compact, the detail drops under the position (2 apart);
 *   nothing is cut or hidden.
 * - Expanded: the modules on bg/faint under a 1px rule, padding 16, gap 8.
 * Closed 1200 × 183 on desktop, 912 × 383 on tablet, 343 × 435 on mobile.
 * Three separate controls: the card's title link covers the card and opens the course page,
 * the card's button opens the player, and the toggle, outside the card, only opens the row.
 */
export function CourseRowCard({
  card,
  position,
  detail,
  modules,
  open,
  onToggle,
  breakpoint = "responsive",
  className,
  style,
}: CourseRowCardProps) {
  const showToast = useLmsStore((s) => s.showToast);
  const uid = React.useId();
  const panelId = `${uid}-modules`;
  const title = card.title;
  const notInPrototype = () => showToast(`${title} is not part of this prototype yet`);
  const responsive = breakpoint === "responsive";
  const compact = breakpoint === "compact";

  return (
    <li
      className={cn("overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page shadow-sk-card", className)}
      style={style}
    >
      {!compact ? (
        <MyLearningCourseCard
          course={card}
          layout="list"
          context="row"
          onAction={notInPrototype}
          className={responsive ? "hidden lg:flex" : undefined}
        />
      ) : null}
      {breakpoint !== "desktop" ? (
        <MyLearningCourseCard
          course={card}
          layout="grid"
          context="row"
          onAction={notInPrototype}
          className={responsive ? "lg:hidden" : undefined}
        />
      ) : null}

      {/* No gap between the two: in the DS bar the texts fill the width left of the toggle.
          A row fixed at Compact sits in a grid cell, 327 wide on mobile: there the toggle stays
          on the line of the position and the detail takes the whole width under them, so a
          module name fits on one line and every closed row keeps one height (67 for the bar). */}
      <div
        className={cn(
          "flex items-center justify-between border-t border-sko-border-subtle px-4 py-3",
          compact && "max-md:flex-wrap max-md:gap-y-0.5",
        )}
      >
        <p className={cn("flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5", compact && "max-md:contents")}>
          <span className={cn("sk-text-body-medium-semibold text-sko-text-default", compact && "max-md:min-w-0 max-md:flex-1")}>
            {position}
          </span>
          <span
            className={cn(
              "sk-text-body-medium-regular text-sko-text-subtle",
              compact ? "w-full max-md:order-last" : "max-md:w-full md:min-w-0 md:flex-1",
            )}
          >
            {detail}
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
        {modules?.length ? (
          <ol
            data-mock="Module durations are not authored yet (effort_time)"
            className="flex flex-col gap-2"
          >
            {modules.map((module) => (
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
