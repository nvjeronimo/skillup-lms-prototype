"use client";

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
  largeTargets: boolean;
  /** Preview flag: the WIP "Discuss this topic" surface. Off by default. */
  discussionsPreview: boolean;

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
  largeTargets: false,
  discussionsPreview: false,

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
      const title = getTopic(topicId)?.title ?? "topic";
      return { completedTopics: next, toast: { message: `Marked as complete · ${title}` } };
    }),

  submitForReview: (topicId) =>
    set((state) => {
      if (state.submittedTopics.has(topicId)) return state;
      const next = new Set(state.submittedTopics);
      next.add(topicId);
      track("topic_submit", { topicId });
      return { submittedTopics: next, toast: { message: "Submitted — under review" } };
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
    set({ largeTargets });
  },
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
      activeLineId: "ln-3",
      toast: { message: "Demo reset to its initial state" },
    });
  },
    }),
    {
      name: "sk-lms-demo",
      version: 1,
      storage: skStorage,
      // Persist demo progress + UI prefs only — not transient/session UI.
      partialize: (s) => ({
        completedTopics: s.completedTopics,
        submittedTopics: s.submittedTopics,
        quizResults: s.quizResults,
        resumePositions: s.resumePositions,
        oraState: s.oraState,
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
        largeTargets: s.largeTargets,
        discussionsPreview: s.discussionsPreview,
      }),
    },
  ),
);

/** Derived helper: does this topic currently have any notes? */
export function useTopicHasNote(lineId: string): boolean {
  return useLmsStore((s) => s.notes.some((n) => n.transcriptLineId === lineId));
}
