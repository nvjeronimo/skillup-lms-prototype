"use client";

import { create } from "zustand";
import { notesSeed, course, getTopic } from "./data";
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
  toggleModule: (moduleId: string) => void;
  openOverlayPanel: (which: "notifications" | "saved") => void;
  closeOverlayPanel: () => void;
  markAllNotificationsRead: (ids: string[]) => void;
  showToast: (message: string, opts?: { actionLabel?: string; onAction?: () => void }) => void;
  clearToast: () => void;
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
        const line = topic?.transcript?.find((l) => l.id === lineId);
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
}));

/** Derived helper: does this topic currently have any notes? */
export function useTopicHasNote(lineId: string): boolean {
  return useLmsStore((s) => s.notes.some((n) => n.transcriptLineId === lineId));
}
