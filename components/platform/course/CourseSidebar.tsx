import * as React from "react";
import { ArrowRight, Bookmark, CalendarPlus, ChevronRight, Megaphone, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CertificateCard } from "@/components/platform/program/CertificatesTab";
import { CardShell, SidebarDateList } from "@/components/platform/program/parts";
import { useLmsStore } from "@/lib/store";
import { courseDetailHref, hasDatesTab, type CourseDetail, type CourseToolId } from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";
import { WeeklyGoalCard } from "./WeeklyGoalCard";
import styles from "./CourseSidebar.module.css";

/* DS icons bookmark, announcement-02, calendar-plus-01 (Untitled UI) → lucide equivalents. */
const TOOL_ICON: Record<CourseToolId, LucideIcon> = {
  bookmarks: Bookmark,
  updates: Megaphone,
  "calendar-sync": CalendarPlus,
};

/**
 * The right column of the Course tab (Sidebar, 6406:39276): seven cards side-gap apart (DS Layout/*), 320 wide on
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
    <aside aria-label="Course details" className={cn(styles.sidebar, className)}>
      <section
        data-theme="dark"
        data-skin={mounted && skin !== "teal" ? skin : undefined}
        data-mock="No mentor field on the Course Home APIs"
        className={styles.mentor}
      >
        <h2 className={`sk-text-label-small-medium ${styles.default}`}>{course.mentor.label}</h2>
        <p className={`sk-text-body-large-semibold ${styles.default}`}>{course.mentor.title}</p>
        <p className={`sk-text-body-medium-regular ${styles.default}`}>{course.mentor.body}</p>
        <ButtonLink href={qaHref} scroll={false} hierarchy="secondary" size="sm" className={styles.fullAction}>
          {course.mentor.cta}
        </ButtonLink>
      </section>

      <CardShell
        label={course.team.label}
        gap="lg"
        mock="No instructor or author field on the Course Home APIs"
        invented="team: no instructor or author field in Open edX"
      >
        <ul className={styles.people}>
          {course.team.people.map((person) => (
            <li key={person.name} className={styles.person}>
              <Avatar name={person.name} size="md" />
              <div className={styles.personText}>
                <p className={`sk-text-body-medium-semibold ${styles.default}`}>{person.name}</p>
                <p className={`sk-text-body-medium-regular ${styles.subtle}`}>{person.role}</p>
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
          className={styles.fullAction}
        >
          {course.team.cta}
        </ButtonLink>
      </CardShell>

      {/* No weekly goal on a passed course (proposal of 10 Oct 2026): the data leaves it out. */}
      {course.weeklyGoal ? <WeeklyGoalCard goal={course.weeklyGoal} courseSlug={course.slug} /> : null}

      <CertificateCard certificate={course.certificate} labelAs="h2" />

      <CardShell label={course.handouts.label} gap="lg">
        {/* Spacing/3xl between the links (24 on desktop, 20 below 1024), as in Figma; each link's
            44 target is a band drawn around its line, so the list keeps its rhythm (Nelson, 28 Oct 2026). */}
        <ul className={styles.handouts}>
          {course.handouts.items.map((item) => (
            <li key={item} className={styles.flexItem}>
              {/* No files in the prototype: say so instead of a dead link. */}
              <button
                type="button"
                onClick={() => notInPrototype(item)}
                className={`sk-text-body-medium-medium ${styles.handout}`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </CardShell>

      {/* Upcoming dates leads to the Dates tab: not on a self-paced course (decision 036). */}
      {hasDatesTab(course) ? (
        <CardShell label={course.upcomingDates.label} gap="lg" mock="The relative labels are computed from the date">
          <SidebarDateList dates={course.upcomingDates.items} />
          <ButtonLink
            href={courseDetailHref(course.slug, "dates")}
            scroll={false}
            hierarchy="link"
            size="sm"
            rightIcon={ArrowRight}
            className={styles.selfStart}
          >
            {course.upcomingDates.cta}
          </ButtonLink>
        </CardShell>
      ) : null}

      <CardShell label={course.tools.label} gap="lg" mock="Tool descriptions are ours; the outline sends a title and a URL">
        <ul className={styles.tools}>
          {course.tools.items.map((tool, index) => (
            <li key={tool.id} className={cn(index < course.tools.items.length - 1 && styles.toolDivider)}>
              <button
                type="button"
                onClick={() => notInPrototype(tool.title)}
                className={styles.tool}
              >
                <span
                  aria-hidden
                  className={styles.toolIcon}
                >
                  <Icon icon={TOOL_ICON[tool.id]} size={18} />
                </span>
                <span className={styles.toolText}>
                  <span className={`sk-text-body-medium-semibold ${styles.default}`}>{tool.title}</span>
                  <span className={`sk-text-body-small-regular ${styles.subtle}`}>{tool.description}</span>
                </span>
                <Icon icon={ChevronRight} size={16} aria-hidden className={styles.chevron} />
              </button>
            </li>
          ))}
        </ul>
      </CardShell>
    </aside>
  );
}
