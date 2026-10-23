"use client";

import * as React from "react";

/**
 * What the learner adds through the prototype's form modals (a question, a post, a support
 * request, a booking, a weekly goal): kept in memory for the session only, never sent and never
 * persisted, so a reload brings the sample data back. One tiny external store, read with
 * `useSessionAdditions(select)`; pages merge these items in front of their sample lists.
 */
type Listener = () => void;

type Additions = {
  /** Questions asked in a course's Mentorship Q&A, by course slug. */
  questions: Record<string, import("@/lib/platform/course-detail").QaThread[]>;
  /** Posts started from Discussion's New post. */
  posts: import("@/lib/platform/discussion").DiscussionThread[];
  /** Support requests sent from Services → Contact support. */
  requests: SessionRequest[];
  /** CV review / interview sessions booked from Services. */
  bookings: SessionBooking[];
  /** The weekly goal set from a course page, by course slug. */
  goals: Record<string, SessionGoal>;
};

export interface SessionRequest {
  id: string;
  number: number;
  topic: string;
  subject: string;
  course?: string;
}

export interface SessionBooking {
  id: string;
  /** "CV review", "Interview practice". */
  service: string;
  /** ISO day and 24 h time, as CalendarEvent. */
  date: string;
  time: string;
  note?: string;
}

export interface SessionGoal {
  /** Open edX `days_per_week`: 1, 3 or 5. */
  days: number;
  /** `subscribed_to_reminders`. */
  reminders: boolean;
}

let state: Additions = { questions: {}, posts: [], requests: [], bookings: [], goals: {} };
const listeners = new Set<Listener>();

function set(next: Partial<Additions>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export const sessionAdditions = {
  addQuestion(slug: string, thread: import("@/lib/platform/course-detail").QaThread) {
    set({ questions: { ...state.questions, [slug]: [thread, ...(state.questions[slug] ?? [])] } });
  },
  addPost(post: import("@/lib/platform/discussion").DiscussionThread) {
    set({ posts: [post, ...state.posts] });
  },
  addRequest(request: Omit<SessionRequest, "number">): SessionRequest {
    // The sample list's open request is 4821; new ones follow it.
    const full = { ...request, number: 4822 + state.requests.length };
    set({ requests: [full, ...state.requests] });
    return full;
  },
  addBooking(booking: SessionBooking) {
    set({ bookings: [booking, ...state.bookings] });
  },
  setGoal(slug: string, goal: SessionGoal) {
    set({ goals: { ...state.goals, [slug]: goal } });
  },
};

/** A stable empty list for selectors (`s.questions[slug] ?? NONE`): a new [] each read would loop. */
export const NONE: never[] = [];

/** `select` must return a value held in the store (or NONE), never a fresh object or array. */
export function useSessionAdditions<T>(select: (s: Additions) => T): T {
  return React.useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => select(state),
    () => select(state),
  );
}

/** A unique id for an item added this session. */
export function sessionId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}
