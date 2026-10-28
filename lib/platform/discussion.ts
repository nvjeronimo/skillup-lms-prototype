import { MENTOR as ACB_MENTOR } from "@/lib/courses/ai-driven-content-and-brand-communication/page";
import { MENTOR as UXR_MENTOR } from "@/lib/courses/ux-research-and-design-thinking/page";
import type { QaMessage } from "./course-detail";

/**
 * Discussion (proposal, 17 Oct 2026): the conversations of every course in one inbox.
 *
 * Open edX discussions are per course (Discussions API v1 on the dev site: threads, comments,
 * `type: question` with endorsed answers, `read`, `unread_comment_count`). Like the Calendar, the
 * page asks every enrolment and merges the threads; a global unread count can come from
 * `/api/notifications/count/` (`count_by_app_name.discussion`, needs the notifications flag).
 * Posting starts in a course: "New post" asks which one.
 */

export type DiscussionKind = "question" | "discussion";

export interface DiscussionThread {
  id: string;
  course: string;
  courseSlug: string;
  /** The course's own discussion topic, as Open edX names it. */
  topic: string;
  kind: DiscussionKind;
  title: string;
  preview: string;
  /** "Ana Costa · 2 h ago". */
  meta: string;
  replies: number;
  /** A question with an endorsed answer. */
  answered?: boolean;
  /** Unread comments since the learner last opened it. */
  unread: number;
  /** Written by the learner. */
  mine?: boolean;
  messages: QaMessage[];
}

export const discussionThreads: DiscussionThread[] = [
  {
    id: "brand-voice-guide-length",
    course: "AI-Driven Content and Brand Communication",
    courseSlug: "ai-driven-content-and-brand-communication",
    topic: "Module 2 · Brand voice",
    kind: "question",
    title: "How long should a brand voice guide be?",
    preview: "Mine is already six pages and I haven't covered channels yet…",
    meta: "You · 1 day ago",
    replies: 3,
    answered: true,
    unread: 2,
    mine: true,
    messages: [
      { id: "m1", from: "learner", author: "You", body: "Mine is already six pages and I haven't covered channels yet. Is there a sensible length for the assignment?", time: "Thu 4:12 PM" },
      { id: "m2", from: "mentor", author: ACB_MENTOR.name, label: "Mentor", accepted: true, body: "Aim for one page people will actually read: three traits, a do/don't for each, and two before/after rewrites. Channel detail can live in an appendix.", time: "Fri 9:30 AM" },
      { id: "m3", from: "mentor", author: "Marco Silva", label: "Learner", body: "That one-page rule helped me too. I put the channel notes in a table at the end.", time: "Fri 11:02 AM" },
    ],
  },
  {
    id: "persona-secondary-data",
    course: "UX Research and Design Thinking",
    courseSlug: "ux-research-and-design-thinking",
    topic: "Module 1 · Personas",
    kind: "question",
    title: "Can a persona be built on secondary data only?",
    preview: "We can't recruit users before the deadline. Is desk research enough?",
    meta: "Priya Nair · 3 h ago",
    replies: 1,
    unread: 1,
    messages: [
      { id: "m1", from: "mentor", author: "Priya Nair", label: "Learner", body: "We can't recruit users before the deadline. Is desk research enough for the persona draft, or will it be marked down?", time: "Today 9:14 AM" },
      { id: "m2", from: "mentor", author: "Leo Martins", label: "Learner", body: "I asked the same last cohort: say clearly it's a proto-persona and list what you'd validate in interviews.", time: "Today 10:40 AM" },
    ],
  },
  {
    id: "async-standup-tools",
    course: "Leadership in Remote Teams",
    courseSlug: "leadership-in-remote-teams",
    topic: "Module 3 · Meetings and rituals",
    kind: "discussion",
    title: "What do you use for async standups?",
    preview: "We tried a Slack bot, then a shared doc. Neither stuck.",
    meta: "Jordan Lee · yesterday",
    replies: 12,
    unread: 4,
    messages: [
      { id: "m1", from: "mentor", author: "Jordan Lee", label: "Learner", body: "We tried a Slack bot, then a shared doc. Neither stuck past week two. What works for your team?", time: "Fri 6:05 PM" },
      { id: "m2", from: "learner", author: "You", body: "Three questions in a thread, posted before 10, and the lead replies to every one. The replies are what kept it alive for us.", time: "Fri 7:20 PM" },
      { id: "m3", from: "mentor", author: "Sam Okafor", label: "Teaching assistant", body: "Good pattern. Module 3's reading has a template if anyone wants to try it this week.", time: "Today 8:00 AM" },
    ],
  },
  {
    id: "sprint-prompt",
    course: "Project Management with AI Tools",
    courseSlug: "project-management-with-ai-tools",
    topic: "Module 2 · Planning with AI",
    kind: "discussion",
    title: "A sprint-planning prompt that worked for me",
    preview: "Sharing the prompt, and where it went wrong the first time.",
    meta: "Elena Rossi · 2 days ago",
    replies: 6,
    unread: 0,
    messages: [
      { id: "m1", from: "mentor", author: "Elena Rossi", label: "Learner", body: "Give it the backlog, the team's capacity and last sprint's velocity, then ask for two plans, not one. The first time I skipped velocity and it planned 140% of capacity.", time: "Thu 2:44 PM" },
    ],
  },
  {
    id: "interview-guide-template",
    course: "UX Research and Design Thinking",
    courseSlug: "ux-research-and-design-thinking",
    topic: "Module 1 · Interviews",
    kind: "question",
    title: "Interview guide: how many questions for 30 minutes?",
    preview: "My draft has 18 questions and feels too long.",
    meta: "You · 4 days ago",
    replies: 2,
    answered: true,
    unread: 0,
    mine: true,
    messages: [
      { id: "m1", from: "learner", author: "You", body: "My draft has 18 questions and feels too long for a 30-minute interview.", time: "Tue 11:20 AM" },
      { id: "m2", from: "mentor", author: UXR_MENTOR.name, label: "Mentor", accepted: true, body: "Six to eight open questions, with follow-ups you don't script. The rest of the time is the participant talking.", time: "Tue 3:05 PM" },
    ],
  },
];

// No Following filter: Discussion has no follow (Kirti removed it; Nelson, 28 Oct 2026).
export const discussionFilters = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "mine", label: "My posts" },
] as const;

export type DiscussionFilter = (typeof discussionFilters)[number]["id"];

export const discussionUnread = discussionThreads.reduce((n, t) => n + t.unread, 0);

export const discussionHref = (threadId?: string) => (threadId ? `/platform/discussion?thread=${threadId}` : "/platform/discussion");
