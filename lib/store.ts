"use client";

import { create } from "zustand";
import { notesSeed, course, getTopic } from "./data";
import { getTranscript } from "./content";
import { track } from "./analytics";
import type { Note, NotePayload } from "./types";

export type TabSlug = "transcript" | "notes" | "downloads";
export type OverlayPanel = null | "notifications" | "saved";

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

  setSidebarExpanded: (v: boolean) => void;
  toggleSidebar: () => void;
  setMobileDrawerOpen: (v: boolean) => void;
  setCurrentTopic: (id: string) => void;
  setCurrentTab: (slug: TabSlug) => void;
  seekVideoTo: (ts: number, lineId?: string) => void;
  setActiveLine: (lineId: string | null) => void;
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
  openOverlayPanel: (which: "notifications" | "saved") => void;
  closeOverlayPanel: () => void;
  markAllNotificationsRead: (ids: string[]) => void;
  showToast: (message: string, opts?: { actionLabel?: string; onAction?: () => void }) => void;
  clearToast: () => void;
  /** Restore the original seeded demo state (completion, quizzes, bookmarks, notes…). */
  resetDemo: () => void;
}

/** Seed bookmarks from the course data (topics flagged bookmarked) + first note topic. */
function seedBookmarks(): Set<string> {
  const set = new Set<string>();
  for (const m of course.modules) {
    const topics = m.topics ?? m.lessons?.flatMap((l) => l.topics) ?? [];
    for (const t of topics) if (t.bookmarked) set.add(t.id);
  }
  return set;
}

/** Seed completed topics from the course data (topics flagged completed). */
function seedCompleted(): Set<string> {
  const set = new Set<string>();
  for (const m of course.modules) {
    const topics = m.topics ?? m.lessons?.flatMap((l) => l.topics) ?? [];
    for (const t of topics) if (t.completed) set.add(t.id);
  }
  return set;
}

let noteCounter = notesSeed.length;

export const useLmsStore = create<LmsState>((set, get) => ({
  sidebarExpanded: true,
  mobileDrawerOpen: false,
  currentTopicId: "m3-t1",
  currentTabSlug: "transcript",
  currentVideoTimestamp: 0,
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
      activeLineId: "ln-3",
      toast: { message: "Demo reset to its initial state" },
    });
  },
}));

/** Derived helper: does this topic currently have any notes? */
export function useTopicHasNote(lineId: string): boolean {
  return useLmsStore((s) => s.notes.some((n) => n.transcriptLineId === lineId));
}
