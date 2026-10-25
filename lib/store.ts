"use client";

import * as React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { notesSeed, allCourses, flatTopics, getTopic } from "./data";
import { getMediaSeconds, getTranscript, isPlaybackMeasured, topicFamily } from "./content";
import { addPlayed, reachedAutoComplete, type Interval } from "./playback/coverage";
import { track } from "./analytics";
import type { Note, NotePayload } from "./types";
import type { LastCompleted } from "./motion/completion";

export type TabSlug = "transcript" | "notes" | "downloads";
export type OverlayPanel = null | "notifications" | "saved" | "discussions";
/** Preview device mode — "auto" follows the window; the rest force a breakpoint + frame. */
export type DeviceMode = "auto" | "desktop" | "tablet" | "mobile";
export type Theme = "light" | "dark";
/** Brand skin — recombinations within the SkillUp palette. */
/** The brand skins the tokens define (tokens/colors.css). Ink, Sky and Violet had no tokens and went on 16 Oct 2026. */
/** "studio" (22 Oct 2026, Nelson) is the experimental whole-platform direction (tokens/direction-studio.css):
 *  it took the place of the Sea skin, which went the same day. */
/** "harbor" (25 Oct 2026, Nelson): a hosting-panel look (tokens/skin-harbor.css): black buttons,
 *  blue links, zinc greys, Plus Jakarta Sans + Figtree. */
/** "fluent" (25 Oct 2026, Nelson): Fluent 2 web (tokens/skin-fluent.css): brand #0F6CBD, 4/8/12
 *  radii, TabList filters, Open Sans for Segoe UI. */
export type Skin = "teal" | "gold" | "red" | "studio" | "harbor" | "fluent";

/** Vision mode — "cvd" = red-green colourblind-safe state colours (deuter + protan). */
export type Vision = "default" | "cvd";

/** Text scale — md = 100%, lg = 115%, xl = 130% (WCAG 1.4.4 resize text). */
export type TextSize = "md" | "lg" | "xl";

/**
 * How a partner lab opens: a new tab (the default), inside the page (the option for the few
 * courses whose lab already loads there), or the frame not loading. See `labLaunch` in the store.
 */
export type LabLaunch = "new-tab" | "inline" | "refused";

/**
 * How a topic the platform cannot measure gets completed. `ask-on-next` is the rule since
 * 12 Oct 2026: the Mark as Complete button, and Next asking whether the learner has completed the
 * topic when they move on without it. `mark-as-complete` is the button alone, as before that
 * date. The names are kept from the first version so stored settings still apply.
 */
export type CompletionFlow = "ask-on-next" | "mark-as-complete";

/** Toast payload — supports an optional inline action (e.g. Undo). */
export interface ToastModel {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface LmsState {
  sidebarExpanded: boolean;
  mobileDrawerOpen: boolean;
  currentTopicId: string;
  currentTabSlug: TabSlug;
  currentVideoTimestamp: number;
  /**
   * Bumped by every `seekVideoTo`, so a player re-applies a jump to the time it already had (the
   * demo's 85% twice, a line clicked again). Session-only.
   */
  seekSeq: number;
  /** Last playback position per video topic, so the learner can resume. */
  resumePositions: Record<string, number>;
  /**
   * Played stretches per video / podcast topic, in seconds (lib/playback/coverage). Persisted, so
   * the 90% of BR-01 is cumulative across sessions. Seeks add nothing; only playback does.
   */
  watched: Record<string, Interval[]>;
  /**
   * ORA progress per topic. The learner returns over days or weeks, so this is
   * persisted: submitted → reviews given → grade released.
   */
  oraState: Record<
    string,
    {
      submitted: boolean;
      fileName?: string;
      reviewsGiven: number;
      /** Peers who have reviewed the learner's own work. */
      reviewsReceived: number;
      /** Populated once the grade is released. */
      score?: number;
      staffOverride?: boolean;
    }
  >;
  /**
   * Partner-lab progress per topic (lab-third-party-platforms.md §4). `openedAt` is when the
   * learner first opened the lab: the launch card shows it. Nothing comes back from the partner,
   * so there is no score here.
   */
  labState: Record<string, { openedAt?: number; completedAt?: number }>;
  /** Transcript line currently highlighted as Active (independent of playback). */
  activeLineId: string | null;
  notes: Note[];
  noteEditor: { open: boolean; lineId?: string; noteId?: string };
  bookmarks: Set<string>;
  /** Topics the learner has explicitly completed (Option A: action in content). */
  completedTopics: Set<string>;
  /**
   * The topic `markComplete` completed last, and when: the completion chain (badge pop → rail
   * check → ring) plays only while it is fresh (`isFreshCompletion`). Session-only, never
   * persisted, so a reload or a later visit shows the finished state without replaying.
   */
  lastCompleted: LastCompleted;
  /**
   * The courses, by slug, whose seeded completion `completedTopics` already holds. A course
   * that is not listed is new to this browser: see `withNewCourses`.
   */
  seededCourses: string[];
  /** Graded topics submitted and awaiting a grade (shows "Under Review"). */
  submittedTopics: Set<string>;
  /** Latest quiz result per topic — score, total + how many attempts taken. */
  quizResults: Record<string, { score: number; total: number; attempts: number }>;
  notificationsRead: Set<string>;
  openPanel: OverlayPanel;
  /** Locally collapsed module groups in the sidebar. */
  collapsedModules: Set<string>;
  /** Ephemeral toast (bookmark feedback, out-of-scope actions). */
  toast: ToastModel | null;
  /** Preview device mode (responsive-mode switcher). */
  deviceMode: DeviceMode;
  /** Colour theme (light / dark). */
  theme: Theme;
  /** Brand skin (palette recombination). */
  skin: Skin;
  /** Vision mode (accessibility): colourblind-safe state colours. */
  vision: Vision;
  /** Accessibility Standards. */
  textSize: TextSize;
  reduceMotion: boolean;
  underlineLinks: boolean;
  /** Experimental (Nelson, 21 Oct 2026): every corner square except buttons'. */
  squareCorners: boolean;
  /**
   * The learner's explicit Larger touch targets choice; `null` = never chosen,
   * so the default applies (ON at ≤767px / mobile preview, OFF otherwise —
   * product decision). Read the effective value with `useLargeTargets()`.
   */
  largeTargetsChoice: boolean | null;
  /** Preview flag: the WIP "Discuss this topic" surface. Off by default. */
  discussionsPreview: boolean;
  /**
   * The quiz A/B mode. Every quiz opens in A, which is the platform today; B
   * is the proposal and has to be asked for. Lives in the demo menu, never on
   * the page: the mode must be visible to whoever is running a session and
   * invisible to whoever is being tested (quizzes/08-two-modes.md §7).
   */
  quizMode: "A" | "B";
  /** Courses that run on a partner's platform (IBM) and that the learner has started there, by slug. */
  hostedCoursesStarted: Record<string, number>;
  /** "Don't show again" on the dialog shown before leaving SkillUp for a hosted course. */
  skipLeavingDialog: boolean;
  /**
   * How a lab that can open inside the page opens. `new-tab` is the default for every lab.
   * `inline` is the lab inside the page (LTI "Open tool in: Inline") and `refused` is the frame
   * not loading, which is what the two Microsoft courses show today. Both live in the demo menu.
   */
  labLaunch: LabLaunch;
  /**
   * Completion of the topics the platform cannot measure (`completesByHand` in lib/content).
   * The button plus the question on Next is the product rule since 12 Oct 2026
   * (lab-third-party-platforms.md §4); the demo menu can switch the question off to compare.
   */
  completionFlow: CompletionFlow;

  setSidebarExpanded: (v: boolean) => void;
  toggleSidebar: () => void;
  setMobileDrawerOpen: (v: boolean) => void;
  setCurrentTopic: (id: string) => void;
  setCurrentTab: (slug: TabSlug) => void;
  seekVideoTo: (ts: number, lineId?: string) => void;
  /**
   * Record where playback stopped (on pause), without it counting as a jump: the player already
   * shows that time. Playback itself keeps the running time in the player, not here.
   */
  syncPlayhead: (ts: number) => void;
  setActiveLine: (lineId: string | null) => void;
  /** Remember where playback stopped for a topic (ignored below 15s). */
  saveResumePosition: (topicId: string, seconds: number) => void;
  /** Forget a stored position — used when the learner restarts from the top. */
  clearResumePosition: (topicId: string) => void;
  /**
   * The player played `topicId` from `from` to `to` (seconds). Adds the stretch to its coverage
   * and, on a measured video or podcast, completes the topic the moment coverage reaches 90%
   * (BR-01, P1-46). Never completes a topic twice. A seek is not reported here.
   */
  recordPlayback: (topicId: string, from: number, to: number) => void;
  /** Demo menu: replace a topic's coverage (e.g. 85% watched). Never completes the topic. */
  setWatched: (topicId: string, intervals: Interval[]) => void;
  /** Demo menu: forget a topic's coverage. Its completion, if any, stays. */
  resetWatched: (topicId: string) => void;
  /** Submit the learner's own ORA response. */
  oraSubmit: (topicId: string, fileName: string) => void;
  /** Record one completed peer review; releases the grade once the quota is met. */
  oraGivePeerReview: (topicId: string) => void;
  /** Demo affordance: simulate a peer reviewing the learner's submission. */
  oraReceivePeerReview: (topicId: string, score: number, staffOverride?: boolean) => void;
  openNoteEditor: (params: { lineId?: string; noteId?: string }) => void;
  closeNoteEditor: () => void;
  saveNote: (note: NotePayload) => void;
  deleteNote: (id: string) => void;
  toggleBookmark: (topicId: string, opts?: { silent?: boolean }) => void;
  /** `silent` completes without the toast: for a topic that completes by itself (an ORA). */
  markComplete: (topicId: string, opts?: { silent?: boolean }) => void;
  submitForReview: (topicId: string) => void;
  /** Record a finished quiz attempt — stores the score, bumps the attempt count, completes the topic. */
  recordQuizResult: (topicId: string, score: number, total: number) => void;
  toggleModule: (moduleId: string) => void;
  openOverlayPanel: (which: "notifications" | "saved" | "discussions") => void;
  closeOverlayPanel: () => void;
  markAllNotificationsRead: (ids: string[]) => void;
  showToast: (message: string, opts?: { actionLabel?: string; onAction?: () => void }) => void;
  clearToast: () => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSkin: (skin: Skin) => void;
  setVision: (vision: Vision) => void;
  setTextSize: (size: TextSize) => void;
  setReduceMotion: (v: boolean) => void;
  setUnderlineLinks: (v: boolean) => void;
  setSquareCorners: (v: boolean) => void;
  setLargeTargets: (v: boolean) => void;
  setDiscussionsPreview: (v: boolean) => void;
  setQuizMode: (v: "A" | "B") => void;
  setLabLaunch: (v: LabLaunch) => void;
  setCompletionFlow: (v: CompletionFlow) => void;
  /** The learner left for the partner's platform to take a hosted course. */
  hostedCourseStarted: (slug: string) => void;
  setSkipLeavingDialog: (v: boolean) => void;
  /** The learner opened the lab on the partner's platform. */
  labOpened: (topicId: string) => void;
  /** Restore the original seeded demo state (completion, quizzes, bookmarks, notes…). */
  resetDemo: () => void;
}

/** localStorage JSON storage that round-trips Set values. */
const noop = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const skStorage = createJSONStorage<Partial<LmsState>>(
  () => (typeof window !== "undefined" ? window.localStorage : (noop as unknown as Storage)),
  {
    replacer: (_k, v) => (v instanceof Set ? { __set: Array.from(v) } : v),
    reviver: (_k, v) => {
      if (v && typeof v === "object" && Array.isArray((v as { __set?: unknown }).__set)) {
        return new Set((v as { __set: unknown[] }).__set);
      }
      return v;
    },
  },
);

/** All topics across every course (so completion/bookmarks seed for the demo courses too). */
const everyTopic = allCourses.flatMap((c) =>
  c.modules.flatMap((m) => m.topics ?? m.lessons?.flatMap((l) => l.topics) ?? []),
);

/** Seed bookmarks from the course data (topics flagged bookmarked). */
function seedBookmarks(): Set<string> {
  return new Set(everyTopic.filter((t) => t.bookmarked).map((t) => t.id));
}

/** Seed completed topics from the course data (topics flagged completed). */
function seedCompleted(): Set<string> {
  return new Set(everyTopic.filter((t) => t.completed).map((t) => t.id));
}

/** Every course whose completion is seeded: what `seededCourses` reads on a fresh browser. */
function seedCourses(): string[] {
  return allCourses.map((c) => c.slug);
}

/** The three sample courses of lib/data: all a stored state knew before v4. */
const COURSES_BEFORE_V4 = ["six-sigma", "capstone", "quick-start"];
/** What a v4 state stored before `seededCourses` existed had been seeded with. */
const COURSES_OF_V4 = [...COURSES_BEFORE_V4, "ai-driven-content-and-brand-communication", "ux-research-and-design-thinking"];

/**
 * Adding a course needs no store version and no migration step. A course's seeded completion
 * is the topics its outline flags `completed` (lib/courses/<slug>/outline.ts). A browser that
 * stored its progress before the course existed does not have them, so every time the stored
 * state is read (`merge` below), the seeded completion of each course it has never seen is
 * added to its completed topics, and the course is recorded as seen. Nothing is ever removed,
 * and a course already seen is left alone, so the learner's own progress in it stands.
 */
function withNewCourses(stored: Partial<LmsState>): Partial<LmsState> {
  // No stored progress: the fresh state stands, and it is seeded with every course.
  if (!stored.completedTopics) return { ...stored, seededCourses: seedCourses() };
  const seen = new Set(stored.seededCourses ?? COURSES_OF_V4);
  const seeded = allCourses
    .filter((c) => !seen.has(c.slug))
    .flatMap((c) => flatTopics(c).filter((t) => t.completed).map((t) => t.id));
  return {
    ...stored,
    completedTopics: new Set([...Array.from(stored.completedTopics), ...seeded]),
    seededCourses: seedCourses(),
  };
}

let noteCounter = notesSeed.length;

export const useLmsStore = create<LmsState>()(
  persist(
    (set, get) => ({
  sidebarExpanded: true,
  mobileDrawerOpen: false,
  currentTopicId: "m3-t1",
  currentTabSlug: "transcript",
  currentVideoTimestamp: 0,
  seekSeq: 0,
  resumePositions: {},
  watched: {},
  oraState: {},
  labState: {},
  activeLineId: "ln-3",
  notes: notesSeed,
  noteEditor: { open: false },
  bookmarks: seedBookmarks(),
  completedTopics: seedCompleted(),
  lastCompleted: null,
  seededCourses: seedCourses(),
  submittedTopics: new Set<string>(),
  quizResults: {},
  notificationsRead: new Set<string>(),
  openPanel: null,
  collapsedModules: new Set<string>(),
  toast: null,
  deviceMode: "auto",
  theme: "light",
  skin: "teal",
  vision: "default",
  textSize: "md",
  reduceMotion: false,
  underlineLinks: false,
  squareCorners: false,
  largeTargetsChoice: null,
  discussionsPreview: false,
  quizMode: "A",
  labLaunch: "new-tab",
  completionFlow: "ask-on-next",
  hostedCoursesStarted: {},
  skipLeavingDialog: false,

  setSidebarExpanded: (v) => set({ sidebarExpanded: v }),
  toggleSidebar: () =>
    set((s) => {
      track("sidebar_collapse", { from: s.sidebarExpanded ? "expanded" : "collapsed" });
      return { sidebarExpanded: !s.sidebarExpanded };
    }),
  setMobileDrawerOpen: (v) => set({ mobileDrawerOpen: v }),
  setCurrentTopic: (id) => set({ currentTopicId: id, mobileDrawerOpen: false }),
  setCurrentTab: (slug) => set({ currentTabSlug: slug }),
  seekVideoTo: (ts, lineId) =>
    set((s) => ({ currentVideoTimestamp: ts, activeLineId: lineId ?? s.activeLineId, seekSeq: s.seekSeq + 1 })),
  syncPlayhead: (ts) => set((s) => (s.currentVideoTimestamp === ts ? s : { currentVideoTimestamp: ts })),
  setActiveLine: (lineId) => set({ activeLineId: lineId }),

  saveResumePosition: (topicId, seconds) =>
    set((s) =>
      // Below 15s there is nothing meaningful to resume to.
      seconds < 15
        ? s
        : { resumePositions: { ...s.resumePositions, [topicId]: Math.round(seconds) } },
    ),
  recordPlayback: (topicId, from, to) => {
    const before = get().watched[topicId] ?? [];
    const after = addPlayed(before, from, to);
    const completed = get().completedTopics.has(topicId);
    const changed = JSON.stringify(after) !== JSON.stringify(before);
    // Nothing new on a completed topic (a rewatch): no write, so persist does not re-serialise.
    if (completed && !changed) return;
    if (changed) set((s) => ({ watched: { ...s.watched, [topicId]: after } }));
    const topic = getTopic(topicId);
    if (!topic || !isPlaybackMeasured(topic) || completed) return;
    // P1-46: at 90% the topic completes, once, with the chain and the toast of markComplete.
    if (reachedAutoComplete(after, getMediaSeconds(topic))) get().markComplete(topicId);
  },
  setWatched: (topicId, intervals) =>
    set((s) => ({ watched: { ...s.watched, [topicId]: intervals } })),
  resetWatched: (topicId) =>
    set((s) => {
      const next = { ...s.watched };
      delete next[topicId];
      return { watched: next };
    }),
  oraSubmit: (topicId, fileName) =>
    set((s) => ({
      oraState: {
        ...s.oraState,
        [topicId]: {
          ...(s.oraState[topicId] ?? { reviewsGiven: 0, reviewsReceived: 0 }),
          submitted: true,
          fileName,
        },
      },
    })),
  oraGivePeerReview: (topicId) =>
    set((s) => {
      const cur = s.oraState[topicId] ?? { submitted: false, reviewsGiven: 0, reviewsReceived: 0 };
      return {
        oraState: { ...s.oraState, [topicId]: { ...cur, reviewsGiven: cur.reviewsGiven + 1 } },
      };
    }),
  oraReceivePeerReview: (topicId, score, staffOverride) =>
    set((s) => {
      const cur = s.oraState[topicId] ?? { submitted: false, reviewsGiven: 0, reviewsReceived: 0 };
      return {
        oraState: {
          ...s.oraState,
          [topicId]: {
            ...cur,
            reviewsReceived: cur.reviewsReceived + 1,
            score,
            staffOverride,
          },
        },
      };
    }),
  clearResumePosition: (topicId) =>
    set((s) => {
      const next = { ...s.resumePositions };
      delete next[topicId];
      return { resumePositions: next };
    }),

  openNoteEditor: ({ lineId, noteId }) => set({ noteEditor: { open: true, lineId, noteId } }),
  closeNoteEditor: () => set({ noteEditor: { open: false } }),

  saveNote: ({ noteId, lineId, text, tags }) =>
    set((state) => {
      track(noteId ? "note_edit" : "note_add", { noteId, lineId, hasTags: tags.length > 0 });
      if (noteId) {
        return {
          notes: state.notes.map((n) =>
            n.id === noteId ? { ...n, text, tags, updatedAt: new Date().toISOString() } : n,
          ),
          noteEditor: { open: false },
        };
      }
      if (lineId) {
        const topic = getTopic(state.currentTopicId);
        const line = topic ? getTranscript(topic).find((l) => l.id === lineId) : undefined;
        const now = new Date().toISOString();
        noteCounter += 1;
        const newNote: Note = {
          id: `note-${noteCounter}`,
          topicId: state.currentTopicId,
          transcriptLineId: lineId,
          ts: line?.ts ?? "0:00",
          anchorQuote: line?.text ?? "",
          text,
          tags,
          createdAt: now,
          updatedAt: now,
        };
        return { notes: [...state.notes, newNote], noteEditor: { open: false } };
      }
      return { noteEditor: { open: false } };
    }),

  deleteNote: (id) =>
    set((state) => {
      track("note_delete", { noteId: id });
      return { notes: state.notes.filter((n) => n.id !== id) };
    }),

  toggleBookmark: (topicId, opts) =>
    set((state) => {
      const next = new Set(state.bookmarks);
      const willAdd = !next.has(topicId);
      if (willAdd) next.add(topicId);
      else next.delete(topicId);
      track(willAdd ? "bookmark_add" : "bookmark_remove", { topicId });

      const update: Partial<LmsState> = { bookmarks: next };
      // Toast feedback with Undo (phase1-readiness §1). Skip on silent (undo) toggles.
      if (!opts?.silent) {
        const title = getTopic(topicId)?.title ?? "topic";
        update.toast = {
          message: willAdd ? `Bookmarked · ${title}` : "Bookmark removed",
          actionLabel: "Undo",
          onAction: () => get().toggleBookmark(topicId, { silent: true }),
        };
      }
      return update;
    }),

  markComplete: (topicId, opts) =>
    set((state) => {
      if (state.completedTopics.has(topicId)) return state;
      const next = new Set(state.completedTopics);
      next.add(topicId);
      const topic = getTopic(topicId);
      // `topicType` (the family: video, podcast, reading…) since 21 Oct 2026, P1-46; added, so
      // a reader of the old shape still finds `topicId`.
      track("topic_complete", { topicId, ...(topic ? { topicType: topicFamily(topic.type) } : {}) });
      const title = topic?.title ?? "topic";
      // A lab remembers the day it was completed.
      const labState =
        topic?.type === "Lab"
          ? { ...state.labState, [topicId]: { ...state.labState[topicId], completedAt: Date.now() } }
          : state.labState;
      // Silent or not, the chain plays: video auto-complete and the Next dialog show it too.
      // The toast is the one announcement (spec §7.2); the chain is visual only.
      const lastCompleted = { topicId, at: Date.now() };
      return opts?.silent
        ? { completedTopics: next, labState, lastCompleted }
        : {
            completedTopics: next,
            labState,
            lastCompleted,
            toast: { message: `Marked as complete · ${title}` },
          };
    }),

  // The date of the FIRST opening is the one kept: opening the lab again does not move it.
  labOpened: (topicId) =>
    set((state) =>
      state.labState[topicId]?.openedAt
        ? state
        : { labState: { ...state.labState, [topicId]: { ...state.labState[topicId], openedAt: Date.now() } } },
    ),

  submitForReview: (topicId) =>
    set((state) => {
      if (state.submittedTopics.has(topicId)) return state;
      const next = new Set(state.submittedTopics);
      next.add(topicId);
      track("topic_submit", { topicId });
      return { submittedTopics: next, toast: { message: "Submitted, under review" } };
    }),

  recordQuizResult: (topicId, score, total) =>
    set((state) => {
      const attempts = (state.quizResults[topicId]?.attempts ?? 0) + 1;
      const firstCompletion = !state.completedTopics.has(topicId);
      const completed = new Set(state.completedTopics);
      completed.add(topicId);
      const type = getTopic(topicId)?.type;
      track("topic_complete", {
        topicId,
        ...(type ? { topicType: topicFamily(type) } : {}),
        kind: "quiz",
        score,
        total,
        attempts,
      });
      return {
        quizResults: { ...state.quizResults, [topicId]: { score, total, attempts } },
        completedTopics: completed,
        // The quiz completing the topic plays the completion chain (rail check → ring),
        // as markComplete does. A retake of a completed quiz does not replay it.
        ...(firstCompletion ? { lastCompleted: { topicId, at: Date.now() } } : {}),
      };
    }),

  toggleModule: (moduleId) =>
    set((state) => {
      const next = new Set(state.collapsedModules);
      const willCollapse = !next.has(moduleId);
      if (willCollapse) next.add(moduleId);
      else next.delete(moduleId);
      track(willCollapse ? "module_collapse" : "module_expand", { moduleId });
      return { collapsedModules: next };
    }),

  openOverlayPanel: (which) => {
    track("panel_open", { panel: which });
    set({ openPanel: which });
  },
  closeOverlayPanel: () => set({ openPanel: null }),

  markAllNotificationsRead: (ids) =>
    set((state) => {
      const next = new Set(state.notificationsRead);
      ids.forEach((id) => next.add(id));
      return { notificationsRead: next };
    }),

  showToast: (message, opts) => set({ toast: { message, ...opts } }),
  clearToast: () => set({ toast: null }),
  setDeviceMode: (mode) => {
    track("device_mode_change", { mode });
    set({ deviceMode: mode });
  },
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((s) => {
      const theme = s.theme === "dark" ? "light" : "dark";
      track("theme_change", { theme });
      return { theme };
    }),
  setVision: (vision) => {
    track("vision_change", { vision });
    set({ vision });
  },
  setTextSize: (textSize) => {
    track("a11y_change", { setting: "textSize", value: textSize });
    set({ textSize });
  },
  setReduceMotion: (reduceMotion) => {
    track("a11y_change", { setting: "reduceMotion", value: String(reduceMotion) });
    set({ reduceMotion });
  },
  setSquareCorners: (squareCorners) => set({ squareCorners }),
  setUnderlineLinks: (underlineLinks) => {
    track("a11y_change", { setting: "underlineLinks", value: String(underlineLinks) });
    set({ underlineLinks });
  },
  setLargeTargets: (largeTargets) => {
    track("a11y_change", { setting: "largeTargets", value: String(largeTargets) });
    set({ largeTargetsChoice: largeTargets });
  },
  setQuizMode: (quizMode) => {
    track("preview_toggle", { feature: "quiz_mode", value: quizMode });
    set({ quizMode });
  },
  setLabLaunch: (labLaunch) => set({ labLaunch }),
  setCompletionFlow: (completionFlow) => {
    track("preview_toggle", { feature: "completion_flow", value: completionFlow });
    set({ completionFlow });
  },
  hostedCourseStarted: (slug) =>
    set((state) => ({ hostedCoursesStarted: { ...state.hostedCoursesStarted, [slug]: Date.now() } })),
  setSkipLeavingDialog: (skipLeavingDialog) => set({ skipLeavingDialog }),
  setDiscussionsPreview: (discussionsPreview) => {
    track("preview_toggle", { feature: "discussions", value: String(discussionsPreview) });
    set({ discussionsPreview });
  },
  setSkin: (skin) => {
    track("skin_change", { skin });
    set({ skin });
  },

  resetDemo: () => {
    noteCounter = notesSeed.length;
    track("demo_reset");
    set({
      completedTopics: seedCompleted(),
      lastCompleted: null,
      seededCourses: seedCourses(),
      submittedTopics: new Set<string>(),
      quizResults: {},
      bookmarks: seedBookmarks(),
      notes: notesSeed,
      notificationsRead: new Set<string>(),
      collapsedModules: new Set<string>(),
      noteEditor: { open: false },
      currentVideoTimestamp: 0,
      resumePositions: {},
      watched: {},
      oraState: {},
      labState: {},
      hostedCoursesStarted: {},
      skipLeavingDialog: false,
      activeLineId: "ln-3",
      toast: { message: "Demo reset to its initial state" },
    });
  },
    }),
    {
      name: "sk-lms-demo",
      version: 7,
      storage: skStorage,
      // v2 dropped the third "Default" quiz mode. Anyone carrying the stored
      // `null` from v1 lands on A, which is what Default resolved to anyway.
      // v3 replaced the boolean `largeTargets` with `largeTargetsChoice`: a stored
      // `true` was a deliberate opt-in and is kept; a stored `false` was only the
      // old default, so it becomes "no choice" and the mobile default applies.
      // v4 added two courses with an outline of their own: a stored set of completed
      // topics predates them. Their seeded completion is added by `withNewCourses`, as for
      // any course added since; the step here only says which courses that state knew.
      // v5 kept only the skins the tokens define: a stored Ink, Sky or Violet goes back to SKO.
      // v6 renamed the Maré skin to Sea.
      // v7 replaced Sea with Studio, which had been a separate switch.
      migrate: (state, from) => {
        let s = (state ?? {}) as Partial<LmsState> & { largeTargets?: boolean };
        if (from < 2 && !s.quizMode) s = { ...s, quizMode: "A" as const };
        if (from < 3) {
          const { largeTargets, ...rest } = s;
          s = { ...rest, largeTargetsChoice: largeTargets ? true : null };
        }
        if (from < 4) s = { ...s, seededCourses: COURSES_BEFORE_V4 };
        if (from < 5 && s.skin && !["teal", "gold", "red", "sea", "mare", "studio", "harbor", "fluent"].includes(s.skin as string)) s = { ...s, skin: "teal" };
        // v6: the Maré skin is called Sea (Nelson, 19 Oct 2026).
        if (from < 6 && (s.skin as string) === "mare") s = { ...s, skin: "sea" as Skin };
        // v7: Studio takes Sea's place among the skins (Nelson, 22 Oct 2026); the old Studio switch
        // becomes that skin, and a stored Sea lands on it too.
        if (from < 7) {
          const { studio, ...rest } = s as typeof s & { studio?: boolean };
          s = rest;
          if (studio || (s.skin as string) === "sea") s = { ...s, skin: "studio" };
        }
        return s;
      },
      // Runs on every read of the stored state, after `migrate`: the default shallow merge,
      // plus the seeded completion of any course added since that state was written.
      merge: (persisted, current) => ({
        ...current,
        ...withNewCourses((persisted ?? {}) as Partial<LmsState>),
      }),
      // Persist demo progress + UI prefs only — not transient/session UI.
      partialize: (s) => ({
        completedTopics: s.completedTopics,
        seededCourses: s.seededCourses,
        submittedTopics: s.submittedTopics,
        quizResults: s.quizResults,
        resumePositions: s.resumePositions,
        watched: s.watched,
        oraState: s.oraState,
        labState: s.labState,
        hostedCoursesStarted: s.hostedCoursesStarted,
        skipLeavingDialog: s.skipLeavingDialog,
        bookmarks: s.bookmarks,
        notes: s.notes,
        notificationsRead: s.notificationsRead,
        collapsedModules: s.collapsedModules,
        sidebarExpanded: s.sidebarExpanded,
        theme: s.theme,
        skin: s.skin,
        vision: s.vision,
        textSize: s.textSize,
        reduceMotion: s.reduceMotion,
        underlineLinks: s.underlineLinks,
        squareCorners: s.squareCorners,
        largeTargetsChoice: s.largeTargetsChoice,
        discussionsPreview: s.discussionsPreview,
        quizMode: s.quizMode,
        labLaunch: s.labLaunch,
        completionFlow: s.completionFlow,
      }),
    },
  ),
);

/** Derived helper: does this topic currently have any notes? */
export function useTopicHasNote(lineId: string): boolean {
  return useLmsStore((s) => s.notes.some((n) => n.transcriptLineId === lineId));
}

/** Viewport width at or below which the product treats the app as mobile. */
export const MOBILE_MAX_WIDTH = 767;

/**
 * Effective Larger touch targets flag: the learner's explicit choice when there
 * is one, otherwise ON on mobile (viewport ≤767px, or the mobile preview frame)
 * and OFF elsewhere. The default never overwrites the stored choice.
 */
export function useLargeTargets(): boolean {
  const choice = useLmsStore((s) => s.largeTargetsChoice);
  const deviceMode = useLmsStore((s) => s.deviceMode);
  const [narrow, setNarrow] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (choice !== null && choice !== undefined) return choice;
  return deviceMode === "mobile" || (deviceMode === "auto" && narrow);
}
