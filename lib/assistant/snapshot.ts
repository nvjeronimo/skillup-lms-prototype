import { completesByHand, getArticle } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { getIssuedCertificate, playerCourse } from "@/lib/platform/catalog";
import { dashboardDue } from "@/lib/platform/dashboard";
import { certificatePageHref } from "@/lib/platform/hrefs";
import { myLearningCourses, myLearningPrograms } from "@/lib/platform/my-learning";
import { DASHBOARD_HREF, MY_LEARNING_HREF, MY_LEARNING_PROGRAMS_HREF } from "@/lib/platform/routes";
import { platformUser } from "@/lib/platform/user";
import type { ActionEntry, LearnerSnapshot, PageContext } from "./types";

/**
 * Everything the assistant knows about the learner, in one object. It repeats what the pages
 * show: courses and programs as My Learning lists them, deadlines as the Dashboard lists them.
 * Those are fixed sample data and disagree with the program page in places (noted 9 Oct 2026);
 * nothing is reconciled here.
 *
 * Dev note: the prototype builds this in the browser because progress lives in local storage.
 * In the product the server builds it from the learner's session (Learner Home for enrolments
 * and resume, the Dates API for deadlines, course blocks for the topic).
 */
export function buildSnapshot(
  state: { completedTopics: Set<string>; bookmarks: Set<string> },
  page: PageContext,
): LearnerSnapshot {
  const courses: LearnerSnapshot["courses"] = myLearningCourses.map((c) => ({
    slug: c.id,
    title: c.title,
    status: c.progressPct === null ? "not-started" : c.progressPct === 100 ? "completed" : "in-progress",
    percent: c.progressPct ?? 0,
    upNext: "title" in c.upNext ? c.upNext.title : undefined,
    playerHref: c.href,
    href: c.detailHref,
  }));
  const programs: LearnerSnapshot["programs"] = myLearningPrograms.map((p) => ({
    slug: p.id,
    title: p.title,
    percent: p.progressPct,
    coursesLine: p.courses,
    upNext: p.upNext,
    href: p.href,
  }));
  const due: LearnerSnapshot["due"] = dashboardDue.map((d) => ({
    id: d.id,
    title: d.title,
    meta: d.meta,
    when: d.when,
    href: d.href,
  }));

  const actions: ActionEntry[] = [
    { id: "dashboard", label: "Open the Dashboard", href: DASHBOARD_HREF },
    { id: "my-learning", label: "Open My Learning", href: MY_LEARNING_HREF },
    { id: "programs", label: "See my programs", href: MY_LEARNING_PROGRAMS_HREF },
  ];
  for (const c of courses) {
    if (c.href) actions.push({ id: `course:${c.slug}`, label: `Open ${c.title}`, href: c.href });
    if (c.playerHref && c.status !== "completed") {
      const verb = c.status === "in-progress" ? "Resume" : "Start";
      actions.push({ id: `resume:${c.slug}`, label: `${verb} ${c.title}`, href: c.playerHref });
    }
    if (getIssuedCertificate(c.slug)) {
      actions.push({
        id: `certificate:${c.slug}`,
        label: `See the certificate for ${c.title}`,
        href: certificatePageHref(c.slug),
      });
    }
  }
  for (const p of programs) {
    if (p.href) actions.push({ id: `program:${p.slug}`, label: `Open ${p.title}`, href: p.href });
  }
  for (const d of due) actions.push({ id: `due:${d.id}`, label: `Open ${d.title}`, href: d.href });

  return {
    learner: { firstName: platformUser.firstName, role: platformUser.role },
    page,
    programs,
    courses,
    due,
    topic: page.kind === "player" ? topicOf(page.courseSlug, page.topicId, state.completedTopics) : undefined,
    actions,
  };
}

/** The topic of a player address, or nothing when the course does not have it. */
function topicOf(courseSlug: string, topicId: string, completed: Set<string>): LearnerSnapshot["topic"] {
  const course = playerCourse(courseSlug);
  const topic = getTopic(topicId, course);
  if (!topic) return undefined;
  return {
    id: topic.id,
    title: topic.title,
    type: topic.type,
    module: topic.moduleTitle,
    course: course.title,
    completed: completed.has(topic.id),
    completesByHand: completesByHand(topic),
    takeaways: getArticle(topic).takeaways,
  };
}
