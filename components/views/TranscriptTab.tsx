"use client";

import * as React from "react";
import { TranscriptLine } from "@/components/molecules/TranscriptLine";
import { useLmsStore } from "@/lib/store";
import { getTopic } from "@/lib/data";
import { tsToSeconds } from "@/lib/utils";

export function TranscriptTab({ topicId }: { topicId: string; courseSlug?: string }) {
  const topic = getTopic(topicId);
  const activeLineId = useLmsStore((s) => s.activeLineId);
  const notes = useLmsStore((s) => s.notes);
  const seekVideoTo = useLmsStore((s) => s.seekVideoTo);
  const openNoteEditor = useLmsStore((s) => s.openNoteEditor);

  if (!topic?.transcript) {
    return (
      <p className="lms-text-sm-regular px-1 py-8 text-center text-lms-text-tertiary">
        No transcript available for this topic.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-2">
      {topic.transcript.map((line) => {
        const note = notes.find((n) => n.transcriptLineId === line.id && n.topicId === topicId);
        const hasNote = Boolean(note);
        return (
          <TranscriptLine
            key={line.id}
            ts={line.ts}
            text={line.text}
            active={line.id === activeLineId}
            hasNote={hasNote}
            onSeek={() => seekVideoTo(tsToSeconds(line.ts), line.id)}
            onAddNote={() => openNoteEditor({ lineId: line.id })}
            onEditNote={() => note && openNoteEditor({ noteId: note.id })}
          />
        );
      })}
    </div>
  );
}
