"use client";

import * as React from "react";
import { AlertCircle, Loader2, Pause, Play, RotateCcw } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn, secondsToTs } from "@/lib/utils";
import type { VideoState } from "@/lib/types";

export interface VideoPlayerProps {
  src?: string;
  /** Total duration in seconds (for the placeholder scrubber). */
  durationSeconds?: number;
  /** Controlled current time. */
  currentTime?: number;
  onSeek?: (seconds: number) => void;
  /** Lifecycle state for edge-case rendering: ready · loading · error · ended. */
  state?: VideoState;
  onRetry?: () => void;
  onReplay?: () => void;
  /** Explicit pixel height (sticky docking). Animates between full + docked heights. */
  heightPx?: number;
  /** Docked (scrolled) treatment: drop shadow + bottom-only corners. */
  docked?: boolean;
  className?: string;
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

/** Translucent surfaces use color-mix on tokens (never hex, never raw rgba). */
const mix = (token: string, pct: number) =>
  `color-mix(in srgb, var(${token}) ${pct}%, transparent)`;

/**
 * Lightweight video player. Branded gradient placeholder (no real asset needed).
 * Controls: play/pause, scrubber, speed, captions, fullscreen — all bound to tokens.
 * Edge states (loading / error / ended) render a centered overlay.
 */
export function VideoPlayer({
  durationSeconds = 200,
  currentTime = 0,
  onSeek,
  state = "ready",
  onRetry,
  onReplay,
  heightPx,
  docked = false,
  className,
}: VideoPlayerProps) {
  const [playing, setPlaying] = React.useState(false);
  const [speedIdx, setSpeedIdx] = React.useState(1);
  const [captions, setCaptions] = React.useState(true);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  const pct = Math.min(100, (currentTime / durationSeconds) * 100);

  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    onSeek?.(Number(e.target.value));
  }

  function toggleFullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }

  const controlBg = { background: mix("--sk-fg-white", 20) };

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative w-full overflow-hidden bg-sk-bg-brand-solid transition-[height,border-radius,box-shadow] duration-200 ease-out",
        // Explicit pixel height drives the sticky full→docked shrink; otherwise
        // fall back to a capped 16:9 band (Storybook / non-sticky usage).
        heightPx ? "" : "aspect-video max-h-[34vh]",
        // Docked treatment: square top, rounded bottom (it's flush to the top).
        docked ? "rounded-b-xl rounded-t-none" : "rounded-xl",
        className,
      )}
      style={{
        height: heightPx,
        boxShadow: docked
          ? "0 4px 16px color-mix(in srgb, var(--sk-text-primary) 18%, transparent)"
          : undefined,
      }}
    >
      {/* Placeholder visual — branded gradient so no real asset is required. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--sk-bg-brand-solid), var(--sk-text-brand-primary))",
        }}
        aria-hidden
      />

      {state === "ready" ? (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <span
            className="inline-flex h-16 w-16 items-center justify-center rounded-full text-sk-text-brand-secondary shadow-lg"
            style={{ background: mix("--sk-bg-primary", 90) }}
          >
            <Icon icon={playing ? Pause : Play} size={28} />
          </span>
        </button>
      ) : (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 text-center"
          style={{ background: mix("--sk-bg-overlay", 55) }}
        >
          {state === "loading" ? (
            <>
              <Loader2 size={36} strokeWidth={2} className="animate-spin text-sk-fg-white" />
              <span className="sk-text-sm-medium text-sk-fg-white">Loading video…</span>
            </>
          ) : null}
          {state === "error" ? (
            <>
              <Icon icon={AlertCircle} size={36} className="text-sk-fg-white" />
              <span className="sk-text-sm-medium text-sk-fg-white">
                Couldn’t load this video.
              </span>
              <button
                type="button"
                onClick={onRetry}
                className="sk-text-sm-semibold rounded-md bg-sk-fg-white px-3 py-1.5 text-sk-text-brand-secondary"
              >
                Retry
              </button>
            </>
          ) : null}
          {state === "ended" ? (
            <>
              <span className="sk-text-md-semibold text-sk-fg-white">You’ve finished this video</span>
              <button
                type="button"
                onClick={onReplay}
                className="sk-text-sm-semibold inline-flex items-center gap-1.5 rounded-md bg-sk-fg-white px-3 py-1.5 text-sk-text-brand-secondary"
              >
                <Icon icon={RotateCcw} size={16} /> Replay
              </button>
            </>
          ) : null}
        </div>
      )}

      {captions && state === "ready" ? (
        <div
          className="absolute bottom-20 left-1/2 z-10 max-w-[80%] -translate-x-1/2 rounded px-3 py-1 text-center"
          style={{ background: mix("--sk-bg-overlay", 75) }}
        >
          <span className="sk-text-sm-medium text-sk-fg-white">
            Welcome back. In this unit we look at the product development lifecycle…
          </span>
        </div>
      ) : null}

      {/* Control bar */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 px-4 pb-3 pt-8"
        style={{
          background: `linear-gradient(to top, ${mix("--sk-bg-overlay", 75)}, transparent)`,
        }}
      >
        <input
          type="range"
          min={0}
          max={durationSeconds}
          value={currentTime}
          onChange={handleScrub}
          aria-label="Seek"
          className="h-1 w-full cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, var(--sk-fg-progress) ${pct}%, var(--sk-bg-tertiary) ${pct}%)`,
          }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="text-sk-fg-white"
            >
              <Icon icon={playing ? Pause : Play} size={20} />
            </button>
            <span className="sk-text-xs-medium text-sk-fg-white">
              {secondsToTs(currentTime)} / {secondsToTs(durationSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
              className="sk-text-xs-semibold rounded px-2 py-1 text-sk-fg-white"
              style={controlBg}
              aria-label="Playback speed"
            >
              {SPEEDS[speedIdx]}×
            </button>
            <button
              type="button"
              onClick={() => setCaptions((c) => !c)}
              aria-pressed={captions}
              aria-label="Toggle captions"
              className={cn(
                "sk-text-xs-semibold rounded px-2 py-1",
                captions ? "text-sk-text-brand-secondary" : "text-sk-fg-white",
              )}
              style={captions ? { background: mix("--sk-fg-white", 90) } : controlBg}
            >
              CC
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="sk-text-xs-semibold rounded px-2 py-1 text-sk-fg-white"
              style={controlBg}
            >
              ⤢
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
