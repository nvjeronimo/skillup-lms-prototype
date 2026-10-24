"use client";

import * as React from "react";
import { OverlayPanel, PanelBody, PanelGroup, PanelSectionLabel } from "./OverlayPanel";
import { PanelTabs } from "@/components/molecules/PanelTabs";
import { SavedTopicItem } from "@/components/molecules/SavedTopicItem";
import { SavedNoteItem } from "@/components/molecules/SavedNoteItem";
import type { SavedNoteModel, SavedTopicModel } from "@/lib/types";
import { staggerStyle } from "@/lib/motion/stagger";

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
  // The rows on screen, topics first: their order is the order they rise in.
  const topicRows = showTopics ? savedTopics.length : 0;
  const rowCount = topicRows + (showNotes ? savedNotes.length : 0);

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

      {/* A new filter cross-fades the list; the rows rise one after the other. */}
      <PanelBody key={filter} className="sk-animate-fade sk-enter-only">
        {showTopics && savedTopics.length ? (
          <section>
            <PanelSectionLabel>Bookmarked topics</PanelSectionLabel>
            <PanelGroup>
              {savedTopics.map((t, i) => (
                <div key={t.id} className="sk-animate-rise sk-rise-nudge sk-enter-only" style={staggerStyle(i, rowCount)}>
                  <SavedTopicItem
                    topicType={t.topicType}
                    duration={t.duration}
                    title={t.title}
                    path={t.path}
                    savedAt={t.savedAt}
                    onClick={() => onSelectTopic?.(t)}
                  />
                </div>
              ))}
            </PanelGroup>
          </section>
        ) : null}

        {showNotes && savedNotes.length ? (
          <section>
            <PanelSectionLabel>Saved notes</PanelSectionLabel>
            <PanelGroup>
              {savedNotes.map((n, i) => (
                <div key={n.id} className="sk-animate-rise sk-rise-nudge sk-enter-only" style={staggerStyle(topicRows + i, rowCount)}>
                  <SavedNoteItem
                    ts={n.ts}
                    topicTitle={n.topicTitle}
                    anchorQuote={n.anchorQuote}
                    text={n.text}
                    tags={n.tags}
                    savedAt={n.savedAt}
                    onClick={() => onSelectNote?.(n)}
                  />
                </div>
              ))}
            </PanelGroup>
          </section>
        ) : null}
      </PanelBody>
    </OverlayPanel>
  );
}
