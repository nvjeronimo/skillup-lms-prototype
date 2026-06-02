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

/** A module's topics whether stored flat or grouped under lessons. */
export function moduleTopics(module: Module): Topic[] {
  if (module.topics) return module.topics;
  if (module.lessons) return module.lessons.flatMap((l) => l.topics);
  return [];
}

/** Flatten every topic in course order, with module/lesson context + index. */
export function flatTopics(c: Course = course): FlatTopic[] {
  const out: FlatTopic[] = [];
  let index = 0;
  for (const module of c.modules) {
    if (module.lessons) {
      for (const lesson of module.lessons) {
        for (const topic of lesson.topics) {
          out.push({
            ...topic,
            moduleId: module.id,
            moduleLabel: module.label,
            moduleTitle: module.title,
            lessonLabel: lesson.label,
            index: index++,
          });
        }
      }
    } else if (module.topics) {
      for (const topic of module.topics) {
        out.push({
          ...topic,
          moduleId: module.id,
          moduleLabel: module.label,
          moduleTitle: module.title,
          index: index++,
        });
      }
    }
  }
  return out;
}

export function getTopic(topicId: string, c: Course = course): FlatTopic | undefined {
  return flatTopics(c).find((t) => t.id === topicId);
}

export function getAdjacentTopics(topicId: string, c: Course = course) {
  const all = flatTopics(c);
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
