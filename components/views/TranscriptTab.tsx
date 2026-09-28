"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { TranscriptLine } from "@/components/molecules/TranscriptLine";
import { ContentFeedback } from "@/components/molecules/ContentFeedback";
import { useLmsStore } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { getTopic } from "@/lib/data";
import { getTranscript } from "@/lib/content";
import { scrollBehavior, tsToSeconds } from "@/lib/utils";
import { track } from "@/lib/analytics";

const PAUSE_MS = 8000;

export function TranscriptTab({ topicId }: { topicId: string; courseSlug?: string }) {
  const topic = getTopic(topicId);
  const transcript = topic ? getTranscript(topic) : [];
  const activeLineId = useLmsStore((s) => s.activeLineId);
  const notes = useLmsStore((s) => s.notes);
  const seekVideoTo = useLmsStore((s) => s.seekVideoTo);
  const openNoteEditor = useLmsStore((s) => s.openNoteEditor);
  const showToast = useLmsStore((s) => s.showToast);
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);
  // DS Transcript Line `Device` variant: mobile stacks the active line's note pill.
  const lineDevice = useBreakpoint() === "mobile" ? "mobile" : "desktop";

  // Auto-follow the active line; pause when the user scrolls manually.
  const [following, setFollowing] = React.useState(true);
  // Direction the user scrolled away in — the "sync" icon points the opposite
  // way (the direction scrollToActive will actually move the viewport).
  const [scrollDirection, setScrollDirection] = React.useState<"up" | "down">("down");
  const lineRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const pauseTimer = React.useRef<number | null>(null);
  const lastTouchY = React.useRef<number | null>(null);

  const scrollToActive = React.useCallback(() => {
    const el = activeLineId ? lineRefs.current[activeLineId] : null;
    el?.scrollIntoView({
      block: "center",
      behavior: scrollBehavior(),
    });
  }, [activeLineId]);

  React.useEffect(() => {
    if (following) scrollToActive();
  }, [activeLineId, following, scrollToActive]);

  function pauseFollow(direction: "up" | "down") {
    setScrollDirection(direction);
    setFollowing(false);
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => setFollowing(true), PAUSE_MS);
  }

  function handleWheel(e: React.WheelEvent) {
    pauseFollow(e.deltaY > 0 ? "down" : "up");
  }

  function handleTouchMove(e: React.TouchEvent) {
    const y = e.touches[0]?.clientY;
    if (y == null) return;
    if (lastTouchY.current != null) {
      // Touch drag down (finger moves down) scrolls content up, and vice versa.
      pauseFollow(y < lastTouchY.current ? "down" : "up");
    }
    lastTouchY.current = y;
  }

  function resumeFollow() {
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    setFollowing(true);
    scrollToActive();
  }

  function handleTouchStart(e: React.TouchEvent) {
    lastTouchY.current = e.touches[0]?.clientY ?? null;
  }

  if (!topic || !transcript.length) {
    return (
      <p className="sk-text-sm-regular px-1 py-8 text-center text-sko-text-subtle">
        No transcript available for this topic.
      </p>
    );
  }

  return (
    <div
      className="relative"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Controls row below the tabs: Language (left) · Add Note (right).
          Transcript download lives in the Downloads tab as a resource. */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2">
        <label className="sk-text-sm-medium flex items-center gap-1.5 text-sko-text-muted">
          Language:
          <span className="relative">
            <select
              aria-label="Caption language"
              onChange={(e) => track("video_language_change", { language: e.target.value })}
              className="sk-text-sm-medium min-h-6 appearance-none bg-transparent pr-5 text-sko-text-default"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-sko-icon-subtle"
            />
          </span>
        </label>
        <button
          type="button"
          onClick={() =>
            openNoteEditor({
              lineId: transcript.some((l) => l.id === activeLineId)
                ? activeLineId ?? undefined
                : transcript[0]?.id,
            })
          }
          // DS Link Button_def, Type=Brand · Hierarchy=Primary · md: 1px bottom stroke in border/primary.
          className="sk-text-sm-semibold inline-flex h-7 items-center gap-1 border-b border-sko-border-primary px-0.5 text-sko-text-primary hover:bg-sko-bg-faint"
        >
          <Icon icon={Plus} size={16} className="text-sko-icon-primary" />
          <span className="px-0.5">Add Note</span>
        </button>
      </div>

      <div className="relative flex flex-col py-2">
        {transcript.map((line) => {
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
                device={lineDevice}
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

        {!following ? (
          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
            <Button
              variant="primary"
              size="sm"
              rightIcon={scrollDirection === "down" ? ChevronUp : ChevronDown}
              onClick={resumeFollow}
            >
              Sync to Video
            </Button>
          </div>
        ) : null}
      </div>

      {/* Feedback + license footer (ICP Phase 1). ContentFeedback carries its own DS
          12/12 padding and right-aligned licence, so no wrapper padding here. */}
      <ContentFeedback
        className="mt-2 border-t border-sko-border-subtle"
        value={feedback}
        onLike={() => setFeedback(feedback === "like" ? null : "like")}
        onDislike={() => setFeedback(feedback === "dislike" ? null : "dislike")}
        onReport={() => showToast("Thanks, we'll take a look.")}
        license="CC BY-SA 4.0"
      />
    </div>
  );
}
