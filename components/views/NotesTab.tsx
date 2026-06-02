"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Info, Search, StickyNote } from "lucide-react";
import { Icon } from "@/lib/icons";
import { NoteItem } from "@/components/molecules/NoteItem";
import { FilterChip } from "@/components/atoms/FilterChip";
import { EmptyState } from "@/components/atoms/EmptyState";
import { useLmsStore } from "@/lib/store";
import { tsToSeconds } from "@/lib/utils";

export function NotesTab({ topicId, courseSlug }: { topicId: string; courseSlug: string }) {
  const router = useRouter();
  const notes = useLmsStore((s) => s.notes).filter((n) => n.topicId === topicId);
  const seekVideoTo = useLmsStore((s) => s.seekVideoTo);
  const setCurrentTab = useLmsStore((s) => s.setCurrentTab);
  const openNoteEditor = useLmsStore((s) => s.openNoteEditor);
  const deleteNote = useLmsStore((s) => s.deleteNote);

  const [query, setQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filtered = notes.filter((n) => {
    const matchesQuery =
      !query ||
      n.text.toLowerCase().includes(query.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    const matchesTag = !activeTag || n.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });

  function goToLine(ts: string, lineId: string) {
    seekVideoTo(tsToSeconds(ts), lineId);
    setCurrentTab("transcript");
    router.push(`/course/${courseSlug}/topic/${topicId}`);
  }

  // No notes at all for this topic → dedicated empty state.
  if (notes.length === 0) {
    return (
      <div className="py-3">
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          description="Create notes from the Transcript tab — click + Note on any line."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-3">
      <div className="flex items-center gap-2 rounded-lg border border-lms-border-primary px-3 py-2">
        <Icon icon={Search} size={18} className="text-lms-text-tertiary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes…"
          className="lms-text-sm-regular flex-1 bg-transparent text-lms-text-primary outline-none"
          aria-label="Search notes"
        />
      </div>

      {allTags.length ? (
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" active={!activeTag} onClick={() => setActiveTag(null)} />
          {allTags.map((tag) => (
            <FilterChip
              key={tag}
              label={`#${tag}`}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </div>
      ) : null}

      {filtered.length ? (
        filtered.map((note) => (
          <NoteItem
            key={note.id}
            ts={note.ts}
            anchorQuote={note.anchorQuote}
            text={note.text}
            tags={note.tags}
            editedLabel="Edited recently"
            onClick={() => goToLine(note.ts, note.transcriptLineId)}
            onEdit={() => openNoteEditor({ noteId: note.id })}
            onDelete={() => {
              if (window.confirm("Delete this note?")) deleteNote(note.id);
            }}
            onTagClick={(t) => setActiveTag(t)}
          />
        ))
      ) : (
        <p className="lms-text-sm-regular py-6 text-center text-lms-text-tertiary">
          No notes match your filter.
        </p>
      )}

      <div className="mt-2 flex items-start gap-2 rounded-lg bg-lms-bg-secondary px-3 py-2.5">
        <Icon icon={Info} size={16} className="mt-0.5 text-lms-text-tertiary" />
        <p className="lms-text-sm-regular text-lms-text-secondary">
          Create notes from the Transcript tab — click <span className="lms-text-sm-semibold">+ Note</span> on any line.
        </p>
      </div>
    </div>
  );
}
