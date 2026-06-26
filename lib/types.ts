/**
 * Domain types for the LMS prototype. Mirrors the shape of `lib/data-model.json`
 * plus the client-side note / panel models from the handoff specs.
 */

export type TopicType =
  | "Video"
  | "Reading"
  | "Quiz"
  | "Lab"
  | "VILT-Live Session"
  | "VILT-Recording"
  | "Activity"
  | "Project"
  | "Practice Assignment"
  | "Graded Assignment"
  | "Peer-graded"
  | "Peer Review"
  | "Discussion Prompt";

export type CompletionState = "Pending" | "In Progress" | "Done" | "Locked";

export interface TranscriptLine {
  id: string;
  ts: string;
  text: string;
  hasNote?: boolean;
}

export interface Topic {
  id: string;
  type: TopicType;
  title: string;
  duration: string;
  completed: boolean;
  active?: boolean;
  locked?: boolean;
  bookmarked?: boolean;
  videoSrc?: string;
  transcript?: TranscriptLine[];
}

export interface Lesson {
  id: string;
  label: string;
  topics: Topic[];
}

export interface Module {
  id: string;
  label: string;
  title: string;
  topicsCompleted: number;
  topicsTotal: number;
  isCompleted: boolean;
  /** Modules either hold topics directly, or group them under lessons (4-level). */
  topics?: Topic[];
  lessons?: Lesson[];
  /**
   * 3-level shape: an implicit module renders its topics directly under the
   * Course Header with NO Module Header / number (Course → Direct Topic Rows).
   */
  implicit?: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  provider: string;
  courseType: "Program" | "Course";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  deliveryMode: "Flexible Learning" | "Flexible + Live" | "Live Sessions";
  overallProgressPct: number;
  modulesCompleted: number;
  modulesTotal: number;
  modules: Module[];
}

export interface Note {
  id: string;
  topicId: string;
  transcriptLineId: string;
  ts: string;
  anchorQuote: string;
  text: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DownloadFile {
  id: string;
  topicId: string;
  type: "PDF" | "DOCX" | "XLSX" | "PPTX" | "ZIP" | "TXT" | "SRT";
  name: string;
  size: string;
  addedAt: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface DataModel {
  course: Course;
  notes: Note[];
  downloads: DownloadFile[];
  user: User;
}

/** Payload used by the note editor when creating / updating a note. */
export interface NotePayload {
  noteId?: string;
  lineId?: string;
  text: string;
  tags: string[];
}

/* ---- Overlay panel models (Notifications + Saved) ---- */

export type NotificationType =
  | "live-now"
  | "live-soon"
  | "course-update"
  | "assignment-due"
  | "discussion-reply"
  | "peer-review-received"
  | "syllabus-change";

/** Hybrid Notifications panel tabs (activity category). */
export type NotificationCategory = "all" | "discussions" | "grading" | "updates";

/** Video player lifecycle state for edge-case rendering. */
export type VideoState = "ready" | "loading" | "error" | "ended";

export interface NotificationModel {
  id: string;
  type: NotificationType;
  title: string;
  body?: string;
  timestamp: string;
  unread: boolean;
  href: string;
  group: "today" | "yesterday" | "this-week" | "older";
}

export interface SavedTopicModel {
  id: string;
  topicId: string;
  topicType: TopicType;
  duration: string;
  title: string;
  path: string;
  savedAt: string;
}

export interface SavedNoteModel {
  id: string;
  noteId: string;
  topicId: string;
  topicTitle: string;
  ts: string;
  anchorQuote: string;
  text: string;
  tags: string[];
  savedAt: string;
}

/** A flattened topic with positional context, used for nav + lookups. */
export interface FlatTopic extends Topic {
  moduleId: string;
  moduleLabel: string;
  moduleTitle: string;
  lessonLabel?: string;
  index: number;
}
