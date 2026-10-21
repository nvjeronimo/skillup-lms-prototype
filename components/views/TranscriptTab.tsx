"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { inertProps } from "@/lib/inert";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useExitTransition, useFrozenWhileClosed } from "@/lib/useExitTransition";
import { TranscriptLine } from "@/components/molecules/TranscriptLine";
import { ContentFeedback } from "@/components/molecules/ContentFeedback";
import { useLmsStore } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { CONTENT_BLEED, CONTENT_PX } from "@/lib/contentPadding";
import { getTopic } from "@/lib/data";
import { getTranscript } from "@/lib/content";
import { tsToSeconds } from "@/lib/utils";
import { scrollToElement } from "@/lib/scrollToElement";
import { track } from "@/lib/analytics";
import { TopicEndActionContext } from "@/lib/topicEndAction";
import { TRANSCRIPT_FOLLOW_PAUSE_MS, isOutOfView, isScrollKey } from "@/lib/motion/feedback";

/** The nearest ancestor that scrolls vertically, or null for the page itself. */
function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const { overflowY } = window.getComputedStyle(p);
    if ((overflowY === "auto" || overflowY === "scroll") && p.scrollHeight > p.clientHeight) return p;
  }
  return null;
}

/**
 * True when the line is not wholly visible in the transcript's scroll box. With no box there
 * is nothing to test against: the page is never scrolled for the transcript (a box below the
 * fold stays below the fold).
 */
function lineOutOfView(el: HTMLElement): boolean {
  const box = scrollParent(el);
  if (!box) return false;
  return isOutOfView(el.getBoundingClientRect(), box.getBoundingClientRect());
}

export function TranscriptTab({ topicId }: { topicId: string; courseSlug?: string }) {
  const topic = getTopic(topicId);
  const transcript = topic ? getTranscript(topic) : [];
  const activeLineId = useLmsStore((s) => s.activeLineId);
  const notes = useLmsStore((s) => s.notes);
  const seekVideoTo = useLmsStore((s) => s.seekVideoTo);
  const openNoteEditor = useLmsStore((s) => s.openNoteEditor);
  const showToast = useLmsStore((s) => s.showToast);
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);
  // Mark as Complete, when the player shell shows it: it sits in the feedback row below.
  const endAction = React.useContext(TopicEndActionContext);
  // DS Transcript Line `Device` variant: mobile stacks the active line's note pill.
  const bp = useBreakpoint();
  const lineDevice = bp === "mobile" ? "mobile" : "desktop";

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
    scrollToElement(el, "center");
  }, [activeLineId]);

  // Not on the first render: scrollIntoView also moves the page, so a topic would open
  // with its title already scrolled under the player. Follow from the first line change on,
  // and only when the active line has left the view: a line on screen stays where the
  // learner is reading it, and one off screen comes in by the shortest way ("nearest").
  const mountedLineId = React.useRef(activeLineId);
  React.useEffect(() => {
    if (mountedLineId.current === activeLineId) return;
    mountedLineId.current = null;
    if (!following) return;
    const el = activeLineId ? lineRefs.current[activeLineId] : null;
    if (el && lineOutOfView(el)) scrollToElement(el, "nearest");
  }, [activeLineId, following]);

  function pauseFollow(direction: "up" | "down") {
    setScrollDirection(direction);
    setFollowing(false);
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => setFollowing(true), TRANSCRIPT_FOLLOW_PAUSE_MS);
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

  // Keys that scroll, pressed in the transcript: the learner is moving it themselves. Not in
  // the language select, and not Space on a control (it presses the control).
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isScrollKey(e.key)) return;
    const t = e.target as HTMLElement;
    if (t.closest("select, input, textarea")) return;
    if (e.key === " " && t.closest("button, a")) return;
    pauseFollow(e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home" ? "up" : "down");
  }

  React.useEffect(
    () => () => {
      if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    },
    [],
  );

  // "Sync to Video" rises in from below (short4) and sinks back down as it leaves (short3,
  // R8/R10), keeping its arrow while it goes; the leaving pill is inert and click-through.
  const pill = useExitTransition(!following, MOTION_MS.short3);
  const pillDirection = useFrozenWhileClosed(scrollDirection, !following);

  if (!topic || !transcript.length) {
    return (
      <p className="sk-text-body-medium-regular px-1 py-8 text-center text-sko-text-subtle">
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
      onKeyDown={handleKeyDown}
    >
      {/* Controls row below the tabs: Language (left) · Add Note (right).
          Transcript download lives in the Downloads tab as a resource. */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2">
        <label className="sk-text-body-medium-medium flex items-center gap-1.5 text-sko-text-muted">
          Language:
          <span className="relative">
            <select
              aria-label="Caption language"
              onChange={(e) => track("video_language_change", { language: e.target.value })}
              className="sk-text-body-medium-medium min-h-6 appearance-none bg-transparent pr-5 text-sko-text-default"
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
          // DS Link Button, Type=Brand · Hierarchy=Primary · md: 1px bottom stroke in border/primary.
          className="sk-text-body-medium-semibold inline-flex h-7 items-center gap-1 border-b border-sko-border-primary px-0.5 text-sko-text-primary transition-colors hover:bg-sko-bg-faint"
        >
          <Icon icon={Plus} size={16} className="text-sko-icon-primary" />
          <span className="px-0.5">Add Note</span>
        </button>
      </div>

      <div className={cn("relative flex flex-col py-2", CONTENT_BLEED[bp])}>
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
                padX={CONTENT_PX[bp]}
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

        {pill.mounted ? (
          <div
            data-state={pill.state}
            onAnimationEnd={pill.onAnimationEnd}
            {...inertProps(pill.state === "closed")}
            className={cn(
              "sk-animate-rise absolute inset-x-0 bottom-4 z-10 flex justify-center",
              pill.state === "closed" && "pointer-events-none",
            )}
          >
            <Button
              variant="primary"
              size="sm"
              rightIcon={pillDirection === "down" ? ChevronUp : ChevronDown}
              onClick={resumeFollow}
            >
              Sync to Video
            </Button>
          </div>
        ) : null}
      </div>

      {/* Feedback + license footer (ICP Phase 1). ContentFeedback carries its own DS
          12/12 padding and right-aligned licence, so no wrapper padding here. With Mark as
          Complete in the row, the licence follows the feedback and the button takes the right. */}
      <ContentFeedback
        className="mt-2 border-t border-sko-border-subtle"
        action={endAction ?? undefined}
        value={feedback}
        onLike={() => setFeedback(feedback === "like" ? null : "like")}
        onDislike={() => setFeedback(feedback === "dislike" ? null : "dislike")}
        onReport={() => showToast("Thanks, we'll take a look.")}
        license="CC BY-SA 4.0"
      />
    </div>
  );
}
