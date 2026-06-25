"use client";

import * as React from "react";
import { ArrowDown, ChevronDown, Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { TranscriptLine } from "@/components/molecules/TranscriptLine";
import { ContentFeedback } from "@/components/molecules/ContentFeedback";
import { useLmsStore } from "@/lib/store";
import { getTopic } from "@/lib/data";
import { tsToSeconds } from "@/lib/utils";
import { track } from "@/lib/analytics";

const PAUSE_MS = 8000;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TranscriptTab({ topicId }: { topicId: string; courseSlug?: string }) {
  const topic = getTopic(topicId);
  const activeLineId = useLmsStore((s) => s.activeLineId);
  const notes = useLmsStore((s) => s.notes);
  const seekVideoTo = useLmsStore((s) => s.seekVideoTo);
  const openNoteEditor = useLmsStore((s) => s.openNoteEditor);
  const showToast = useLmsStore((s) => s.showToast);
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);

  // Auto-follow the active line; pause when the user scrolls manually.
  const [following, setFollowing] = React.useState(true);
  const lineRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const pauseTimer = React.useRef<number | null>(null);

  const scrollToActive = React.useCallback(() => {
    const el = activeLineId ? lineRefs.current[activeLineId] : null;
    el?.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeLineId]);

  React.useEffect(() => {
    if (following) scrollToActive();
  }, [activeLineId, following, scrollToActive]);

  function pauseFollow() {
    setFollowing(false);
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => setFollowing(true), PAUSE_MS);
  }

  function resumeFollow() {
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    setFollowing(true);
    scrollToActive();
  }

  if (!topic?.transcript) {
    return (
      <p className="sk-text-sm-regular px-1 py-8 text-center text-sk-text-tertiary">
        No transcript available for this topic.
      </p>
    );
  }

  return (
    <div className="relative" onWheel={pauseFollow} onTouchMove={pauseFollow}>
      {/* Controls row below the tabs: Language (left) · Add Note (right).
          Transcript download lives in the Downloads tab as a resource. */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2">
        <label className="sk-text-sm-medium flex items-center gap-1.5 text-sk-text-secondary">
          Language:
          <span className="relative">
            <select
              aria-label="Caption language"
              onChange={(e) => track("video_language_change", { language: e.target.value })}
              className="sk-text-sm-medium appearance-none bg-transparent pr-5 text-sk-text-primary outline-none"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-sk-text-tertiary"
            />
          </span>
        </label>
        <button
          type="button"
          onClick={() => openNoteEditor({ lineId: activeLineId ?? topic.transcript?.[0]?.id })}
          className="sk-text-sm-semibold inline-flex items-center gap-1 text-sk-text-brand-secondary hover:underline"
        >
          <Icon icon={Plus} size={16} />
          Add Note
        </button>
      </div>

      {!following ? (
        <button
          type="button"
          onClick={resumeFollow}
          className="sk-text-xs-semibold sticky top-2 z-10 ml-auto flex items-center gap-1.5 rounded-full bg-sk-bg-brand-section px-3 py-1.5 text-sk-text-brand-secondary shadow-sm"
        >
          Following
          <Icon icon={ArrowDown} size={14} />
          <span className="text-sk-text-brand">· Resume</span>
        </button>
      ) : null}

      <div className="flex flex-col py-2">
        {topic.transcript.map((line) => {
          const note = notes.find((n) => n.transcriptLineId === line.id && n.topicId === topicId);
          const hasNote = Boolean(note);
          return (
            <div
              key={line.id}
              ref={(el) => {
                lineRefs.current[line.id] = el;
              }}
            >
              <TranscriptLine
                ts={line.ts}
                text={line.text}
                active={line.id === activeLineId}
                hasNote={hasNote}
                onSeek={() => {
                  seekVideoTo(tsToSeconds(line.ts), line.id);
                  track("transcript_line_click", { lineId: line.id, newTs: line.ts });
                  resumeFollow();
                }}
                onAddNote={() => openNoteEditor({ lineId: line.id })}
                onEditNote={() => note && openNoteEditor({ noteId: note.id })}
              />
            </div>
          );
        })}
      </div>

      {/* Feedback + license footer (ICP Phase 1). */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-sk-border-secondary pt-3">
        <ContentFeedback
          value={feedback}
          onLike={() => setFeedback(feedback === "like" ? null : "like")}
          onDislike={() => setFeedback(feedback === "dislike" ? null : "dislike")}
          onReport={() => showToast("Thanks — we'll take a look.")}
        />
        <a href="#" className="sk-text-xs-regular text-sk-text-tertiary hover:text-sk-text-brand-secondary">
          CC BY-SA 4.0
        </a>
      </div>
    </div>
  );
}
