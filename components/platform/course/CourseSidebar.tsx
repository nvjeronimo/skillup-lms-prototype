"use client";

import * as React from "react";
import { ArrowRight, Bookmark, CalendarPlus, ChevronRight, Megaphone, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CertificateCard } from "@/components/platform/program/CertificatesTab";
import { CardShell, SidebarDateList } from "@/components/platform/program/parts";
import { useLmsStore } from "@/lib/store";
import { courseDetailHref, type CourseDetail, type CourseToolId } from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";
import { WeeklyGoalCard } from "./WeeklyGoalCard";

/* DS icons bookmark, announcement-02, calendar-plus-01 (Untitled UI) → lucide equivalents. */
const TOOL_ICON: Record<CourseToolId, LucideIcon> = {
  bookmarks: Bookmark,
  updates: Megaphone,
  "calendar-sync": CalendarPlus,
};

/**
 * The right column of the Course tab (Sidebar, 6406:39276): seven cards 16 apart, 320 wide on
 * desktop and tablet; on mobile they follow the modules at full width, in the same order.
 * - Mentor (`Sidebar-Card` Kind=Mentor Q&A): pinned to the dark Semantics mode in the DS, so
 *   the card carries `data-theme="dark"`; bg/primary-soft, the title, a line and a Secondary
 *   button that opens the Mentorship Q&A tab;
 * - Course team (Kind=Team): DS Avatar md + name + role, and "Ask the course team", which
 *   opens Mentorship Q&A (a question to the course, map §20.3);
 * - Weekly goal (./WeeklyGoalCard) and Certificate (the Program page's Certificate card);
 * - Handouts (Kind=Handouts): underlined links, body-medium/Medium;
 * - Upcoming dates (Kind=Dates): the date rows of the Program sidebar and "All dates", which
 *   opens the Dates tab;
 * - Course tools (Kind=Tools): rows of a 36px icon tile, title, description and chevron.
 */
export function CourseSidebar({ course, className }: { course: CourseDetail; className?: string }) {
  const showToast = useLmsStore((s) => s.showToast);
  // The brand skin lives on <html>; a nested dark card needs it repeated to pick the matching
  // dark brand ramp. Read after mount so the server markup stays skin-neutral.
  const skin = useLmsStore((s) => s.skin);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const notInPrototype = (what: string) => showToast(`${what} is not part of this prototype yet`);
  const qaHref = courseDetailHref(course.slug, "qa");

  return (
    <aside aria-label="Course details" className={cn("flex flex-col gap-4", className)}>
      <section
        data-theme="dark"
        data-skin={mounted && skin !== "teal" ? skin : undefined}
        data-mock="No mentor field on the Course Home APIs"
        className="flex flex-col gap-3 rounded-[10px] border border-sko-border-subtle bg-sko-bg-primary-soft p-[15px]"
      >
        <h2 className="sk-text-label-small-medium text-sko-text-default">{course.mentor.label}</h2>
        <p className="sk-text-body-large-semibold text-sko-text-default">{course.mentor.title}</p>
        <p className="sk-text-body-medium-regular text-sko-text-default">{course.mentor.body}</p>
        <ButtonLink href={qaHref} scroll={false} hierarchy="secondary" size="sm" className="w-full max-md:h-11">
          {course.mentor.cta}
        </ButtonLink>
      </section>

      <CardShell label={course.team.label} gap="lg" mock="No instructor or author field on the Course Home APIs">
        <ul className="flex flex-col gap-4">
          {course.team.people.map((person) => (
            <li key={person.name} className="flex items-center gap-2">
              <Avatar name={person.name} size="md" />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="sk-text-body-medium-semibold text-sko-text-default">{person.name}</p>
                <p className="sk-text-body-medium-regular text-sko-text-subtle">{person.role}</p>
              </div>
            </li>
          ))}
        </ul>
        <ButtonLink
          href={qaHref}
          scroll={false}
          hierarchy="secondary"
          size="sm"
          leftIcon={MessageCircle}
          className="w-full max-md:h-11"
        >
          {course.team.cta}
        </ButtonLink>
      </CardShell>

      <WeeklyGoalCard goal={course.weeklyGoal} />

      <CertificateCard certificate={course.certificate} labelAs="h2" />

      <CardShell label={course.handouts.label} gap="lg">
        <ul className="flex flex-col items-start gap-2">
          {course.handouts.items.map((item) => (
            <li key={item} className="flex">
              {/* No files in the prototype: say so instead of a dead link. */}
              <button
                type="button"
                onClick={() => notInPrototype(item)}
                className="sk-text-body-medium-medium text-left text-sko-text-on-primary-soft underline underline-offset-2 hover:text-sko-text-primary max-md:min-h-11"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </CardShell>

      <CardShell label={course.upcomingDates.label} gap="lg" mock="The relative labels are computed from the date">
        <SidebarDateList dates={course.upcomingDates.items} />
        <ButtonLink
          href={courseDetailHref(course.slug, "dates")}
          scroll={false}
          hierarchy="link"
          size="sm"
          rightIcon={ArrowRight}
          className="self-start"
        >
          {course.upcomingDates.cta}
        </ButtonLink>
      </CardShell>

      <CardShell label={course.tools.label} gap="lg" mock="Tool descriptions are ours; the outline sends a title and a URL">
        <ul className="flex flex-col">
          {course.tools.items.map((tool, index) => (
            <li key={tool.id} className={cn(index < course.tools.items.length - 1 && "border-b border-sko-border-subtle")}>
              <button
                type="button"
                onClick={() => notInPrototype(tool.title)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sko-bg-subtle text-sko-icon-default"
                >
                  <Icon icon={TOOL_ICON[tool.id]} size={18} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="sk-text-body-medium-semibold text-sko-text-default">{tool.title}</span>
                  <span className="sk-text-body-small-regular text-sko-text-subtle">{tool.description}</span>
                </span>
                <Icon icon={ChevronRight} size={16} aria-hidden className="shrink-0 text-sko-icon-muted" />
              </button>
            </li>
          ))}
        </ul>
      </CardShell>
    </aside>
  );
}
