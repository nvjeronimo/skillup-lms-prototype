import raw from "./data-model.json";
import type {
  Course,
  DataModel,
  DownloadFile,
  FlatTopic,
  Module,
  Note,
  NotificationModel,
  SavedNoteModel,
  SavedTopicModel,
  Topic,
  User,
} from "./types";

const model = raw as unknown as DataModel;

export const course: Course = model.course;
export const notesSeed: Note[] = model.notes;
export const downloads: DownloadFile[] = model.downloads;
export const user: User = model.user;

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

/** A module's topics whether stored flat or grouped under lessons. */
export function moduleTopics(mod: Module): Topic[] {
  if (mod.topics) return mod.topics;
  if (mod.lessons) return mod.lessons.flatMap((l) => l.topics);
  return [];
}

/** Flatten every topic in course order, with module/lesson context + index. */
export function flatTopics(c: Course = course): FlatTopic[] {
  const out: FlatTopic[] = [];
  let index = 0;
  for (const mod of c.modules) {
    if (mod.lessons) {
      for (const lesson of mod.lessons) {
        for (const topic of lesson.topics) {
          out.push({
            ...topic,
            moduleId: mod.id,
            moduleLabel: mod.label,
            moduleTitle: mod.title,
            lessonLabel: lesson.label,
            index: index++,
          });
        }
      }
    } else if (mod.topics) {
      for (const topic of mod.topics) {
        out.push({
          ...topic,
          moduleId: mod.id,
          moduleLabel: mod.label,
          moduleTitle: mod.title,
          index: index++,
        });
      }
    }
  }
  return out;
}

/** Every course the app can render, addressable by slug. */
export const allCourses: Course[] = [course, fourLevelCourse, threeLevelCourse];
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
export const DEFAULT_TOPIC_ID = "m3-t1";
export const DEFAULT_COURSE_SLUG = course.slug;

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
      return "discussions";
    case "assignment-due":
    case "peer-review-received":
      return "grading";
    default:
      return "updates";
  }
}

/* ---- Mock notifications for the Notifications panel ---- */
export const notifications: NotificationModel[] = [
  {
    id: "n1",
    type: "live-now",
    title: "Live now: Office hours with Sarah",
    body: "Drop in for Q&A on the DMAIC define phase.",
    timestamp: "Just now",
    unread: true,
    href: "/course/six-sigma/topic/m3-t1",
    group: "today",
  },
  {
    id: "n2",
    type: "discussion-reply",
    title: "Carlos M. replied to your discussion",
    body: "“Great point on measurement systems analysis — but what about gauge R&R?”",
    timestamp: "25 min ago",
    unread: true,
    href: "/course/six-sigma/topic/m3-t1",
    group: "today",
  },
  {
    id: "n3",
    type: "assignment-due",
    title: "Practice Quiz: Define and measure is due in 2 days",
    body: "Module 03 · Define and measure",
    timestamp: "2 hours ago",
    unread: true,
    href: "/course/six-sigma/topic/m3-t4",
    group: "today",
  },
  {
    id: "n4",
    type: "course-update",
    title: "Sarah added new content: Prompt review recording",
    body: "A new recording was added to Module 03.",
    timestamp: "Yesterday, 4:10 PM",
    unread: false,
    href: "/course/six-sigma/topic/m3-t2",
    group: "yesterday",
  },
  {
    id: "n5",
    type: "peer-review-received",
    title: "Anonymous peer rated your submission 4/5",
    body: "“Clear analysis, tighten the control plan.”",
    timestamp: "Yesterday, 9:02 AM",
    unread: false,
    href: "/course/six-sigma/topic/m3-t7",
    group: "yesterday",
  },
  {
    id: "n6",
    type: "syllabus-change",
    title: "Module 04 syllabus updated",
    body: "Two readings were re-ordered and one was added.",
    timestamp: "Mon, 11:30 AM",
    unread: false,
    href: "/course/six-sigma/topic/m3-t1",
    group: "this-week",
  },
];

/* ---- Mock saved topics for the Saved panel ---- */
export const savedTopics: SavedTopicModel[] = [
  {
    id: "st1",
    topicId: "m3-t3",
    topicType: "Reading",
    duration: "approx. 8 min read",
    title: "The measure phase",
    path: "Six Sigma · DMAIC for process improvement · Define and measure",
    savedAt: "2 days ago",
  },
  {
    id: "st2",
    topicId: "m1-t2",
    topicType: "Video",
    duration: "5 min",
    title: "History and origins",
    path: "Six Sigma · Introduction to ASQ-Certified Six Sigma Black Belt",
    savedAt: "1 week ago",
  },
  {
    id: "st3",
    topicId: "m3-t7",
    topicType: "Graded Assignment",
    duration: "approx. 20 min",
    title: "The control phase",
    path: "Six Sigma · DMAIC for process improvement · Analyze, improve, and control",
    savedAt: "1 week ago",
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
  savedAt: i === 0 ? "3 days ago" : "3 days ago",
}));
