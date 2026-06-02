"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Icon } from "@/lib/icons";
import { TranscriptLine } from "@/components/molecules/TranscriptLine";
import { VideoChromeFooter } from "@/components/molecules/VideoChromeFooter";
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
      <p className="lms-text-sm-regular px-1 py-8 text-center text-lms-text-tertiary">
        No transcript available for this topic.
      </p>
    );
  }

  return (
    <div className="relative" onWheel={pauseFollow} onTouchMove={pauseFollow}>
      {/* Video chrome footer sits at the top of the transcript tab (per Final Screens). */}
      <VideoChromeFooter
        onLanguageChange={(code) => track("video_language_change", { language: code })}
        onDownloadTranscript={(format) => {
          track("download_transcript", { format });
          showToast(`Downloading transcript (.${format})…`);
        }}
      />

      {!following ? (
        <button
          type="button"
          onClick={resumeFollow}
          className="lms-text-xs-semibold sticky top-2 z-10 ml-auto flex items-center gap-1.5 rounded-full bg-lms-bg-brand-section px-3 py-1.5 text-lms-text-brand-secondary shadow-sm"
        >
          Following
          <Icon icon={ArrowDown} size={14} />
          <span className="text-lms-text-brand">· Resume</span>
        </button>
      ) : null}

      <div className="flex flex-col gap-1 py-2">
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
    </div>
  );
}
