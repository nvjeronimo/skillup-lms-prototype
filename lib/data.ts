import raw from "./data-model.json";
import { COURSES } from "./courses";
import { DEFAULT_TOPIC_ID, flattenOutline, moduleTopics, resumeTopicOf } from "./courses/outline";
import { ACTIVE_PERSONA } from "./persona-active";
import { SAMPLE_TODAY, addDays, formatMonthDay } from "./sample-time";
import type {
  Course,
  DataModel,
  DownloadFile,
  FlatTopic,
  Note,
  NotificationModel,
  Partner,
  SavedNoteModel,
  SavedTopicModel,
  User,
} from "./types";

const model = raw as unknown as DataModel;

export const course: Course = model.course;
export const notesSeed: Note[] = model.notes;
export const downloads: DownloadFile[] = model.downloads;
/** The mock learner as written (John Smith), whatever persona is on. */
export const DEFAULT_USER: User = model.user;
/**
 * The signed-in learner. In the browser, while a synthetic persona is on, the persona's name
 * (Nelson, 25 Oct 2026; lib/persona-active), with no picture so the initials show; on the
 * server always the written one. Outside a gated page read it through `useLearner()`.
 */
export const user: User = ACTIVE_PERSONA ? { ...model.user, id: ACTIVE_PERSONA.id, name: ACTIVE_PERSONA.name, avatarUrl: "" } : model.user;

/* ----------------------------------------------------------------------------
 * Demo courses for the Sidebar content-shape preview (Showcases & Diagrams).
 * `course` above is the 5-level shape (Course → Module → Lesson → Topics).
 * ---------------------------------------------------------------------------- */

/** 4-level: Course → Module → Topics (no Lesson layer). */
export const fourLevelCourse: Course = {
  id: "cap",
  slug: "capstone",
  title: "Capstone Project Workshop",
  provider: "SkillUp",
  // Co-delivered course: the Course Header shows every partner, in order.
  partners: [{ name: "SkillUp" }, { name: "Microsoft" }],
  courseType: "Course",
  difficulty: "Intermediate",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 67,
  modulesCompleted: 2,
  modulesTotal: 3,
  modules: [
    {
      id: "cap-m1",
      label: "Module 01",
      title: "Scoping your project",
      topicsCompleted: 2,
      topicsTotal: 2,
      isCompleted: true,
      topics: [
        { id: "cap-t1", type: "Video", title: "Framing the brief", duration: "3m 20s", completed: true },
        { id: "cap-t2", type: "Reading", title: "Choosing a measurable goal", duration: "8 min", completed: true },
      ],
    },
    {
      id: "cap-m2",
      label: "Module 02",
      title: "Building the deliverable",
      topicsCompleted: 2,
      topicsTotal: 2,
      isCompleted: true,
      topics: [
        { id: "cap-t3", type: "Video", title: "From outline to draft", duration: "3m 20s", completed: true },
        { id: "cap-t4", type: "Activity", title: "Draft your one-pager", duration: "10 min", completed: true },
      ],
    },
    {
      id: "cap-m3",
      label: "Module 03",
      title: "Peer review assignment",
      topicsCompleted: 0,
      topicsTotal: 3,
      isCompleted: false,
      topics: [
        { id: "cap-t5", type: "Video", title: "Submit your work", duration: "3m 20s", completed: false, active: true },
        { id: "cap-t6", type: "Peer Review", title: "Review 2 peer submissions", duration: "3m 20s", completed: false },
        { id: "cap-t7", type: "Graded Assignment", title: "Reflection essay (300 words)", duration: "3m 20s", completed: false, locked: true },
      ],
    },
  ],
};

/** 3-level: Course → Topics (no Module, no Lesson — implicit module). */
export const threeLevelCourse: Course = {
  id: "qs",
  slug: "quick-start",
  title: "Quick-start onboarding",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 25,
  modulesCompleted: 0,
  modulesTotal: 1,
  modules: [
    {
      id: "qs-m",
      label: "",
      title: "",
      implicit: true,
      topicsCompleted: 1,
      topicsTotal: 4,
      isCompleted: false,
      topics: [
        { id: "qs-t1", type: "Video", title: "Introduction to the DMAIC methodology", duration: "3m 20s", completed: true },
        { id: "qs-t2", type: "Quiz", title: "Practice Quiz: Define and Measure", duration: "3m 20s", completed: false, active: true },
        { id: "qs-t3", type: "Reading", title: "Reading: Hierarchy in mockups", duration: "3m 20s", completed: false },
        { id: "qs-t4", type: "Video", title: "Capstone reflection", duration: "3m 20s", completed: false, locked: true },
      ],
    },
  ],
};

/* ----------------------------------------------------------------------------
 * Platform courses with an outline of their own (asked by Nelson on 9 Oct 2026).
 * Each one lives in its folder under lib/courses and is listed in lib/courses/index
 * (how to add one: lib/courses/README.md). Every other course of the catalogue still
 * plays `course` above under its own title (lib/platform/catalog). Ids are prefixed so
 * they stay unique across courses: `getCourseForTopic` finds a course by topic id alone.
 * ---------------------------------------------------------------------------- */

/** Partners for the Course Header: the explicit list, else the provider alone. */
export function coursePartners(c: Course): Partner[] {
  return c.partners ?? [{ name: c.provider }];
}

export { moduleTopics };

/** Flatten every topic in course order, with module/lesson context + index. */
export function flatTopics(c: Course = course): FlatTopic[] {
  return flattenOutline(c);
}

/** Every course the app can render, addressable by slug. */
export const allCourses: Course[] = [course, fourLevelCourse, threeLevelCourse, ...COURSES.map((c) => c.outline)];
export const coursesBySlug: Record<string, Course> = Object.fromEntries(
  allCourses.map((c) => [c.slug, c]),
);
export function getCourseBySlug(slug: string): Course {
  return coursesBySlug[slug] ?? course;
}
export function getCourseForTopic(topicId: string): Course {
  return allCourses.find((c) => flatTopics(c).some((t) => t.id === topicId)) ?? course;
}

export function getTopic(topicId: string, c?: Course): FlatTopic | undefined {
  for (const courseToSearch of c ? [c] : allCourses) {
    const found = flatTopics(courseToSearch).find((t) => t.id === topicId);
    if (found) return found;
  }
  return undefined;
}

export function getAdjacentTopics(topicId: string, c?: Course) {
  const all = flatTopics(c ?? getCourseForTopic(topicId));
  const i = all.findIndex((t) => t.id === topicId);
  return {
    current: all[i],
    previous: i > 0 ? all[i - 1] : undefined,
    next: i >= 0 && i < all.length - 1 ? all[i + 1] : undefined,
    total: all.length,
    position: i + 1,
  };
}

export function topicNotes(topicId: string, allNotes: Note[] = notesSeed): Note[] {
  return allNotes.filter((n) => n.topicId === topicId);
}

export function topicDownloads(topicId: string): DownloadFile[] {
  return downloads.filter((d) => d.topicId === topicId);
}

/** Build the "Course · Module · Lesson" path string for a topic. */
export function topicPath(topicId: string, c: Course = course): string {
  const t = getTopic(topicId, c);
  if (!t) return c.title;
  return [c.title, t.moduleTitle, t.lessonLabel].filter(Boolean).join(" · ");
}

/* ---- Default topic the app redirects to (the Active video) ---- */
export { DEFAULT_TOPIC_ID };
export const DEFAULT_COURSE_SLUG = course.slug;

/**
 * The topic a course's player opens on (`resumeUrl`): the one its outline flags `active`,
 * else its first topic still to do. A slug with no outline of its own plays the sample
 * course, so it opens where the sample does.
 */
export function resumeTopicId(slug: string): string {
  const own = coursesBySlug[slug];
  return own ? resumeTopicOf(own) : DEFAULT_TOPIC_ID;
}

/* ---- Certificate (Section 07) ---- */
export const certificate = {
  learnerName: user.name,
  courseTitle: course.title,
  provider: course.provider,
  dateLabel: "June 22, 2026",
  certificateId: "ID-SKL-SIXSIGMA-0622",
  stats: {
    modules: course.modulesTotal,
    topics: flatTopics().length,
    time: "4h 22m",
    avgQuiz: "96%",
  },
};

/** Map a notification type to its hybrid-tab activity category. */
export function notificationCategory(
  type: NotificationModel["type"],
): "discussions" | "grading" | "updates" {
  switch (type) {
    case "discussion-reply":
    case "instructor-post":
      return "discussions";
    case "ora-grade-received":
      return "grading";
    default:
      return "updates";
  }
}

/* ---- Mock notifications for the Notifications panel ----
   The types Open edX sends, in its own words (Teak/Ulmo notifications): Discussions (a response,
   a comment or an endorsement on my post; a new post from the instructor), Updates (course
   updates) and Grading (an ORA grade, with no score in the text). The body is the context line of
   Figma Overlay Card 1 (3827:65480): where it happened, "course · module"; the row adds the time
   (Nelson's SKO match review, 28 Oct 2026). */
export const notifications: NotificationModel[] = [
  {
    id: "n1",
    type: "instructor-post",
    title: "Sarah Lee posted in Six Sigma: Office hours recap",
    body: "Six Sigma · Module 03",
    timestamp: "Just now",
    unread: true,
    href: "/course/six-sigma/topic/m3-t1",
    group: "today",
  },
  {
    id: "n2",
    type: "discussion-reply",
    title: "Carlos M. responded to your post",
    body: "Six Sigma · Module 03",
    timestamp: "25 min ago",
    unread: true,
    href: "/course/six-sigma/topic/m3-t1",
    group: "today",
  },
  {
    id: "n3",
    type: "discussion-reply",
    title: "Your response was endorsed",
    body: "Six Sigma · Module 03",
    timestamp: "2 hours ago",
    unread: true,
    href: "/course/six-sigma/topic/m3-t4",
    group: "today",
  },
  {
    id: "n4",
    type: "course-update",
    title: "New course update in Six Sigma",
    body: "Six Sigma · Module 03",
    timestamp: "Yesterday, 4:10 PM",
    unread: false,
    href: "/course/six-sigma/topic/m3-t2",
    group: "yesterday",
  },
  {
    id: "n5",
    type: "ora-grade-received",
    title: "Your assessment was graded: Control plan",
    body: "Six Sigma · Module 03",
    timestamp: "Yesterday, 9:02 AM",
    unread: false,
    href: "/course/six-sigma/topic/m3-t7",
    group: "yesterday",
  },
  {
    id: "n6",
    type: "course-update",
    title: "New course update in Six Sigma",
    body: "Six Sigma · Module 04",
    timestamp: "Mon, 11:30 AM",
    unread: false,
    href: "/course/six-sigma/topic/m3-t1",
    group: "this-week",
  },
];

/* ---- Mock saved topics for the Saved panel ----
   As Figma Overlay Card 2 (3827:65749; Nelson's SKO match review, 28 Oct 2026): the path by
   number ("Six Sigma · Module 03 · Lesson 1") and absolute dates, Open edX's "Oct 22". */
export const savedTopics: SavedTopicModel[] = [
  {
    id: "st1",
    topicId: "m3-t3",
    topicType: "Reading",
    duration: "8 min read approx.",
    title: "The measure phase",
    path: "Six Sigma · Module 03 · Lesson 1",
    savedAt: formatMonthDay(addDays(SAMPLE_TODAY, -2)),
  },
  {
    id: "st2",
    topicId: "m1-t2",
    topicType: "Video",
    duration: "5 min",
    title: "History and origins",
    path: "Six Sigma · Module 01",
    savedAt: formatMonthDay(addDays(SAMPLE_TODAY, -7)),
  },
  {
    id: "st3",
    topicId: "m3-t7",
    topicType: "Graded Assignment",
    duration: "20 min approx.",
    title: "The control phase",
    path: "Six Sigma · Module 03 · Lesson 2",
    savedAt: formatMonthDay(addDays(SAMPLE_TODAY, -7)),
  },
];

/** Saved notes are derived from seed notes but carry display metadata. */
export const savedNotes: SavedNoteModel[] = notesSeed.map((n, i) => ({
  id: `sn${i + 1}`,
  noteId: n.id,
  topicId: n.topicId,
  topicTitle: "Introduction to the DMAIC methodology",
  ts: n.ts,
  anchorQuote: n.anchorQuote,
  text: n.text,
  tags: n.tags,
  savedAt: formatMonthDay(addDays(SAMPLE_TODAY, -3)),
}));
