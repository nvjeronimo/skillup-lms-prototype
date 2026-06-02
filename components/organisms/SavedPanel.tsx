"use client";

import * as React from "react";
import { OverlayPanel, PanelSectionLabel } from "./OverlayPanel";
import { SavedTopicItem } from "@/components/molecules/SavedTopicItem";
import { SavedNoteItem } from "@/components/molecules/SavedNoteItem";
import type { SavedNoteModel, SavedTopicModel } from "@/lib/types";

export type SavedFilter = "all" | "topics" | "notes";

export interface SavedPanelProps {
  open: boolean;
  onClose: () => void;
  savedTopics: SavedTopicModel[];
  savedNotes: SavedNoteModel[];
  filter?: SavedFilter;
  onFilterChange?: (f: SavedFilter) => void;
  onSelectTopic?: (t: SavedTopicModel) => void;
  onSelectNote?: (n: SavedNoteModel) => void;
}

/** Saved panel: filter chips + bookmarked topics + saved notes. */
export function SavedPanel({
  open,
  onClose,
  savedTopics,
  savedNotes,
  filter = "all",
  onFilterChange,
  onSelectTopic,
  onSelectNote,
}: SavedPanelProps) {
  const showTopics = filter === "all" || filter === "topics";
  const showNotes = filter === "all" || filter === "notes";

  const filters = [
    { label: "All", value: "all", count: savedTopics.length + savedNotes.length, active: filter === "all" },
    { label: "Topics", value: "topics", count: savedTopics.length, active: filter === "topics" },
    { label: "Notes", value: "notes", count: savedNotes.length, active: filter === "notes" },
  ];

  return (
    <OverlayPanel
      open={open}
      onClose={onClose}
      title="Saved"
      filters={filters}
      onFilterChange={(v) => onFilterChange?.(v as SavedFilter)}
      footer={{ label: "View all saved items", href: "#" }}
    >
      {showTopics && savedTopics.length ? (
        <section className="mb-2">
          <PanelSectionLabel>Bookmarked topics</PanelSectionLabel>
          <div className="divide-y divide-lms-border-secondary">
            {savedTopics.map((t) => (
              <SavedTopicItem
                key={t.id}
                topicType={t.topicType}
                duration={t.duration}
                title={t.title}
                path={t.path}
                savedAt={t.savedAt}
                onClick={() => onSelectTopic?.(t)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {showNotes && savedNotes.length ? (
        <section className="mb-2">
          <PanelSectionLabel>Saved notes</PanelSectionLabel>
          <div className="divide-y divide-lms-border-secondary">
            {savedNotes.map((n) => (
              <SavedNoteItem
                key={n.id}
                ts={n.ts}
                topicTitle={n.topicTitle}
                anchorQuote={n.anchorQuote}
                text={n.text}
                tags={n.tags}
                savedAt={n.savedAt}
                onClick={() => onSelectNote?.(n)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </OverlayPanel>
  );
}
