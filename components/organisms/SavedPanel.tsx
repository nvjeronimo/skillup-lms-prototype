"use client";

import * as React from "react";
import { OverlayPanel, PanelSectionLabel } from "./OverlayPanel";
import { PanelTabs } from "@/components/molecules/PanelTabs";
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

/** Saved panel: category tabs + bookmarked topics + saved notes. */
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

  const tabs = [
    { value: "all", label: "All", count: savedTopics.length + savedNotes.length },
    { value: "topics", label: "Topics", count: savedTopics.length },
    { value: "notes", label: "Notes", count: savedNotes.length },
  ];

  return (
    <OverlayPanel open={open} onClose={onClose} title="Saved" footer={{ label: "View all saved items", href: "#" }}>
      <PanelTabs
        tabs={tabs}
        active={filter}
        onChange={(v) => onFilterChange?.(v as SavedFilter)}
        ariaLabel="Saved filters"
      />

      {showTopics && savedTopics.length ? (
        <section>
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
        <section>
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
