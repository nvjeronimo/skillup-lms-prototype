"use client";

import * as React from "react";
import { OverlayPanel, PanelSectionLabel } from "./OverlayPanel";
import { DiscussionPrompt } from "@/components/molecules/DiscussionPrompt";
import { ThreadItem } from "@/components/molecules/ThreadItem";
import type { DiscussionThread } from "@/lib/content";

export interface DiscussionsPanelProps {
  open: boolean;
  onClose: () => void;
  /** The current topic — the panel opens on its thread. */
  topicTitle: string;
  topicDuration?: string;
  threads: DiscussionThread[];
  onPost?: (text: string) => void;
  onOpenThread?: () => void;
}

/**
 * Course-level Discussions space (right-rail panel). Discussion is no longer a
 * topic type — this panel is the home for all threads, opening by default on the
 * current topic's thread. Reuses the DiscussionPrompt input and ThreadItem list.
 */
export function DiscussionsPanel({
  open,
  onClose,
  topicTitle,
  topicDuration,
  threads,
  onPost,
  onOpenThread,
}: DiscussionsPanelProps) {
  return (
    <OverlayPanel
      open={open}
      onClose={onClose}
      title="Discussions"
      footer={{ label: "View all course discussions", href: "#" }}
    >
      <PanelSectionLabel>On this topic</PanelSectionLabel>
      <DiscussionPrompt prompt={`${topicTitle}: what's your take?`} duration={topicDuration} onSubmit={onPost} />

      <PanelSectionLabel>{threads.length} responses from your cohort</PanelSectionLabel>
      <div className="flex flex-col gap-2">
        {threads.map((t, i) => (
          <ThreadItem
            key={i}
            author={t.author}
            timestamp={t.timestamp}
            content={t.content}
            replies={t.replies}
            upvotes={t.upvotes}
            onClick={onOpenThread}
          />
        ))}
      </div>
    </OverlayPanel>
  );
}
