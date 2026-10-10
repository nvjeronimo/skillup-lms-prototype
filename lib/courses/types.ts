import type {
  ActivityContent,
  ArticleContent,
  AssignmentBrief,
  DownloadLabContent,
  LessonPageContent,
  OraContent,
  PodcastContent,
  QuizQuestion,
  TopicByline,
  ViltSession,
} from "@/lib/content";
import type { CourseDetail } from "@/lib/platform/course-detail";
import type { Course } from "@/lib/types";

/**
 * An Activity as a course writes it: the purpose (`intro`), the steps of the exercise, the last
 * of which says what a good result looks like, and the worksheet the steps refer to (`file`).
 * It is a checklist unless `kind` says "scorm".
 */
export type CourseActivity = Omit<ActivityContent, "kind"> & Partial<Pick<ActivityContent, "kind">>;

/**
 * What a course with its own outline says in the player in place of the Six Sigma
 * sample. Written for the topics a learner is most likely to open: the one the course
 * resumes on, one reading, one practice quiz and the assignment the Dashboard lists as due.
 * A video's own transcript sits on the topic itself, in the outline. Every other topic of
 * the course gets plain wording that names no subject (the end of lib/content).
 */
export interface CourseContent {
  byline: TopicByline;
  /** The questions of every quiz of the course that has none of its own. */
  quiz: QuizQuestion[];
  /** By topic id. */
  articles: Record<string, Omit<ArticleContent, "byline">>;
  quizzes: Record<string, QuizQuestion[]>;
  assignments: Record<string, AssignmentBrief>;
  ora: Record<string, OraContent>;
  /*
   * The topic types below are optional: a course lists them only when its outline has such
   * a topic. A topic with no entry gets plain wording that names no subject, never the sample.
   */
  /** A Lab the learner runs on their own machine: intro, prerequisites, steps, files. By topic id. */
  labs?: Record<string, DownloadLabContent>;
  /** A Podcast: host, guest, summary and chapters. Its length is the topic's `duration`. */
  podcasts?: Record<string, Omit<PodcastContent, "durationSeconds">>;
  /** A Lesson Page: its intro and its blocks, in order. */
  lessonPages?: Record<string, LessonPageContent>;
  /** A VILT session (live or recording): only the fields that differ from the plain session. */
  sessions?: Record<string, Partial<Omit<ViltSession, "stage" | "title">>>;
  /** An Activity: its purpose, its steps and its worksheet. */
  activities?: Record<string, CourseActivity>;
}
/**
 * One course with content of its own, as its folder exports it (lib/courses/<slug>/index.ts)
 * and as the registry lists it (lib/courses/index.ts).
 */
export interface CourseEntry {
  /**
   * The player outline. Its `slug` is the course's address; its `id` is the prefix of every
   * module, lesson, topic and transcript-line id in it. A topic flagged `completed` is done
   * when the demo starts (the store seeds its completion from here); the one flagged
   * `active` is where Resume lands.
   */
  outline: Course;
  /** The course page, /platform/course/<slug>. */
  page: CourseDetail;
  /** Topic bodies and the byline of the course. */
  content: CourseContent;
}
