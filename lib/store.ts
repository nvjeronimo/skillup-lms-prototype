"use client";

import * as React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { notesSeed, allCourses, getTopic } from "./data";
import { getTranscript } from "./content";
import { track } from "./analytics";
import type { Note, NotePayload } from "./types";

export type TabSlug = "transcript" | "notes" | "downloads";
export type OverlayPanel = null | "notifications" | "saved" | "discussions";
/** Preview device mode — "auto" follows the window; the rest force a breakpoint + frame. */
export type DeviceMode = "auto" | "desktop" | "tablet" | "mobile";
export type Theme = "light" | "dark";
/** Brand skin — recombinations within the SkillUp palette. */
export type Skin = "teal" | "ink" | "sky" | "violet" | "gold" | "red";

/** Vision mode — "cvd" = red-green colourblind-safe state colours (deuter + protan). */
export type Vision = "default" | "cvd";

/** Text scale — md = 100%, lg = 115%, xl = 130% (WCAG 1.4.4 resize text). */
export type TextSize = "md" | "lg" | "xl";

/** LTI "Open tool in" (plus the refused-frame fallback). See `labLaunch` in the store. */
export type LabLaunch = "new-tab" | "inline" | "modal" | "refused";

/** Where the partner stand-in page (app/partner) leaves a lab score for SkillUp to collect. */
export const LAB_SCORES_KEY = "sk-lab-scores";

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
  /** Last playback position per video topic, so the learner can resume. */
  resumePositions: Record<string, number>;
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
   * Partner-lab progress per topic (lab-third-party-platforms.md). `openedAt` is when the
   * learner last left for the partner's platform; `score` is what an LTI lab sent back.
   */
  labState: Record<
    string,
    { openedAt?: number; completedAt?: number; score?: { earned: number; total: number } }
  >;
  /** Transcript line currently highlighted as Active (independent of playback). */
  activeLineId: string | null;
  notes: Note[];
  noteEditor: { open: boolean; lineId?: string; noteId?: string };
  bookmarks: Set<string>;
  /** Topics the learner has explicitly completed (Option A: action in content). */
  completedTopics: Set<string>;
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
  /**
   * How an LTI lab opens. `new-tab` is how the Google labs are authored today. `inline` and
   * `modal` are the other two values of the LTI component's "Open tool in" setting, and
   * `refused` is what the learner gets when the provider does not allow the frame. The last
   * three wait for the content team's test in Studio, so they live in the demo menu only.
   */
  labLaunch: LabLaunch;

  setSidebarExpanded: (v: boolean) => void;
  toggleSidebar: () => void;
  setMobileDrawerOpen: (v: boolean) => void;
  setCurrentTopic: (id: string) => void;
  setCurrentTab: (slug: TabSlug) => void;
  seekVideoTo: (ts: number, lineId?: string) => void;
  setActiveLine: (lineId: string | null) => void;
  /** Remember where playback stopped for a topic (ignored below 15s). */
  saveResumePosition: (topicId: string, seconds: number) => void;
  /** Forget a stored position — used when the learner restarts from the top. */
  clearResumePosition: (topicId: string) => void;
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
  markComplete: (topicId: string) => void;
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
  setLargeTargets: (v: boolean) => void;
  setDiscussionsPreview: (v: boolean) => void;
  setQuizMode: (v: "A" | "B") => void;
  setLabLaunch: (v: LabLaunch) => void;
  /** The learner opened the lab on the partner's platform. */
  labOpened: (topicId: string) => void;
  /** The partner sent a score back (LTI): stores it and completes the topic. */
  labScoreReceived: (topicId: string, earned: number, total: number) => void;
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

let noteCounter = notesSeed.length;

export const useLmsStore = create<LmsState>()(
  persist(
    (set, get) => ({
  sidebarExpanded: true,
  mobileDrawerOpen: false,
  currentTopicId: "m3-t1",
  currentTabSlug: "transcript",
  currentVideoTimestamp: 0,
  resumePositions: {},
  oraState: {},
  labState: {},
  activeLineId: "ln-3",
  notes: notesSeed,
  noteEditor: { open: false },
  bookmarks: seedBookmarks(),
  completedTopics: seedCompleted(),
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
  largeTargetsChoice: null,
  discussionsPreview: false,
  quizMode: "A",
  labLaunch: "new-tab",

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
    set((s) => ({ currentVideoTimestamp: ts, activeLineId: lineId ?? s.activeLineId })),
  setActiveLine: (lineId) => set({ activeLineId: lineId }),

  saveResumePosition: (topicId, seconds) =>
    set((s) =>
      // Below 15s there is nothing meaningful to resume to.
      seconds < 15
        ? s
        : { resumePositions: { ...s.resumePositions, [topicId]: Math.round(seconds) } },
    ),
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

  markComplete: (topicId) =>
    set((state) => {
      if (state.completedTopics.has(topicId)) return state;
      const next = new Set(state.completedTopics);
      next.add(topicId);
      track("topic_complete", { topicId });
      const topic = getTopic(topicId);
      const title = topic?.title ?? "topic";
      // A lab remembers the day it was completed: its launch card states it.
      const labState =
        topic?.type === "Lab"
          ? { ...state.labState, [topicId]: { ...state.labState[topicId], completedAt: Date.now() } }
          : state.labState;
      return { completedTopics: next, labState, toast: { message: `Marked as complete · ${title}` } };
    }),

  labOpened: (topicId) =>
    set((state) => ({
      labState: { ...state.labState, [topicId]: { ...state.labState[topicId], openedAt: Date.now() } },
    })),

  labScoreReceived: (topicId, earned, total) =>
    set((state) => {
      if (state.labState[topicId]?.score) return state;
      const completed = new Set(state.completedTopics);
      completed.add(topicId);
      track("topic_complete", { topicId });
      const title = getTopic(topicId)?.title ?? "lab";
      return {
        completedTopics: completed,
        labState: {
          ...state.labState,
          [topicId]: { ...state.labState[topicId], completedAt: Date.now(), score: { earned, total } },
        },
        toast: { message: `Score received · ${title}` },
      };
    }),

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
      const completed = new Set(state.completedTopics);
      completed.add(topicId);
      track("topic_complete", { topicId, kind: "quiz", score, total, attempts });
      return {
        quizResults: { ...state.quizResults, [topicId]: { score, total, attempts } },
        completedTopics: completed,
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
      submittedTopics: new Set<string>(),
      quizResults: {},
      bookmarks: seedBookmarks(),
      notes: notesSeed,
      notificationsRead: new Set<string>(),
      collapsedModules: new Set<string>(),
      noteEditor: { open: false },
      currentVideoTimestamp: 0,
      resumePositions: {},
      oraState: {},
      labState: {},
      activeLineId: "ln-3",
      toast: { message: "Demo reset to its initial state" },
    });
  },
    }),
    {
      name: "sk-lms-demo",
      version: 3,
      storage: skStorage,
      // v2 dropped the third "Default" quiz mode. Anyone carrying the stored
      // `null` from v1 lands on A, which is what Default resolved to anyway.
      // v3 replaced the boolean `largeTargets` with `largeTargetsChoice`: a stored
      // `true` was a deliberate opt-in and is kept; a stored `false` was only the
      // old default, so it becomes "no choice" and the mobile default applies.
      migrate: (state, from) => {
        let s = (state ?? {}) as Partial<LmsState> & { largeTargets?: boolean };
        if (from < 2 && !s.quizMode) s = { ...s, quizMode: "A" as const };
        if (from < 3) {
          const { largeTargets, ...rest } = s;
          s = { ...rest, largeTargetsChoice: largeTargets ? true : null };
        }
        return s;
      },
      // Persist demo progress + UI prefs only — not transient/session UI.
      partialize: (s) => ({
        completedTopics: s.completedTopics,
        submittedTopics: s.submittedTopics,
        quizResults: s.quizResults,
        resumePositions: s.resumePositions,
        oraState: s.oraState,
        labState: s.labState,
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
        largeTargetsChoice: s.largeTargetsChoice,
        discussionsPreview: s.discussionsPreview,
        quizMode: s.quizMode,
        labLaunch: s.labLaunch,
      }),
    },
  ),
);

// The partner stand-in (app/partner) runs in another tab, or in a frame on the lab topic.
// It leaves the score under LAB_SCORES_KEY, the way an LTI tool posts a grade back to the
// platform, and never applies it itself: only the SkillUp side keeps score. A SkillUp page
// picks it up at once through the `storage` event, or on its next load if none was open.
function applyLabScores() {
  try {
    const raw = window.localStorage.getItem(LAB_SCORES_KEY);
    if (!raw) return;
    window.localStorage.removeItem(LAB_SCORES_KEY);
    const scores = JSON.parse(raw) as Record<string, { earned: number; total: number }>;
    for (const [topicId, score] of Object.entries(scores)) {
      useLmsStore.getState().labScoreReceived(topicId, score.earned, score.total);
    }
  } catch {
    // Storage blocked or a malformed entry: the lab simply stays "waiting for your score".
  }
}
if (typeof window !== "undefined" && !window.location.pathname.startsWith("/partner")) {
  applyLabScores();
  window.addEventListener("storage", (event) => {
    if (event.key === LAB_SCORES_KEY && event.newValue) applyLabScores();
  });
}

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
