import type { CourseDate, CourseDateBadge, CourseDetail } from "./course-detail";

/**
 * The Dates tab as Open edX serves it (Nelson, 28 Oct 2026: everything Open edX-based, no extra
 * development). The course files keep their written rows; this turns them into what
 * `course_date_blocks[]` can carry, so every page that reads a Dates tab (the tab, the Calendar,
 * the Dashboard) shows the platform's dates only.
 *
 * Source: edx-platform `lms/djangoapps/courseware/date_summary.py` (the date types and their
 * texts) and frontend-app-learning `dates-tab/timeline/badgelist.jsx` (the badges). Docs:
 * LMS-HANDOFF/edx-dates-tab.md.
 * - Date types: course start, course end, assignment due, certificate available, upgrade
 *   deadline, audit access expires (and today, the divider). No program dates, no "suggested
 *   start": those rows are dropped.
 * - Assignments carry no description; the assignment type prefixes the title ("Homework: …").
 * - Badges: Completed, Past due (amber: a missed suggested date can be shifted, so it is a
 *   warning, never red; Open edX draws it neutral), Due next (ONE item: the next incomplete
 *   assignment), Not yet released (the assignment has no link yet).
 */

const GRAY = "gray" as const;

const STATUS: Record<"complete" | "overdue" | "locked" | "dueNext", CourseDateBadge> = {
  complete: { label: "Completed", color: "success" },
  overdue: { label: "Past due", color: "warning" },
  locked: { label: "Not yet released", color: GRAY },
  dueNext: { label: "Due next", color: GRAY },
};

/** The platform's sentences for the course end (`CourseEndDate.description`). */
const COURSE_END = {
  upcoming: "After the course ends, the course content will be archived and no longer active.",
  past: "This course is archived, which means you can review course content but it is no longer active.",
};

const isAssignment = (row: CourseDate) => row.badges[0]?.label === "Due date";

/** One written row as a `course_date_blocks[]` entry, or null when Open edX has no such date. */
function edxRow(row: CourseDate, past: boolean, dueNextId: string | undefined): CourseDate | null {
  const type = row.badges[0]?.label;
  if (isAssignment(row)) {
    const assignmentType = row.assignmentType ?? row.badges[1]?.label;
    const status =
      row.state === "complete"
        ? STATUS.complete
        : row.state === "overdue"
          ? STATUS.overdue
          : row.state === "locked"
            ? STATUS.locked
            : row.id === dueNextId
              ? STATUS.dueNext
              : null;
    return {
      ...row,
      assignmentType,
      badges: [{ label: "Due date", color: GRAY }, ...(status ? [status] : [])],
      description: "",
      // Not yet released: no link in Open edX until the content is out.
      link: row.state === "locked" ? undefined : row.link,
    };
  }
  const only = (label: string, title: string, description: string): CourseDate => ({
    ...row,
    badges: [{ label, color: GRAY }],
    title,
    description,
  });
  switch (type) {
    case "Course":
      if (/suggested start/i.test(row.title)) return null;
      if (/enrol/i.test(row.title)) return only("Course", "Enrollment date", "");
      if (/ends/i.test(row.title)) return only("Course", "Course ends", past ? COURSE_END.past : COURSE_END.upcoming);
      return only("Course", "Course starts", "");
    case "Certificate":
      return only("Certificate", "Certificate available", "Day certificates will become available for passing learners.");
    case "Upgrade":
      return only("Upgrade", "Upgrade deadline", row.description);
    case "Access":
      return only("Access", "Audit access expires", "You lose all access to this course, including your progress.");
    default:
      // Program dates are not course dates: the course's Dates tab does not carry them.
      return null;
  }
}

/** The Dates tab of a course reduced to what Open edX returns. */
export function edxDatesTab(tab: CourseDetail["datesTab"]): CourseDetail["datesTab"] {
  const dueNext = tab.upcoming
    .filter((r) => isAssignment(r) && r.state === "upcoming")
    .sort((a, b) => a.iso.localeCompare(b.iso))[0];
  const map = (rows: CourseDate[], past: boolean) =>
    rows.map((r) => edxRow(r, past, dueNext?.id)).filter((r): r is CourseDate => r !== null);
  return { ...tab, past: map(tab.past, true), upcoming: map(tab.upcoming, false) };
}
