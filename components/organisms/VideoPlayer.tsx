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

  const controlBg = { background: mix("--lms-fg-white", 20) };

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl bg-lms-bg-brand-solid",
        className,
      )}
    >
      {/* Placeholder visual — branded gradient so no real asset is required. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--lms-bg-brand-solid), var(--lms-text-brand-primary))",
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
            className="inline-flex h-16 w-16 items-center justify-center rounded-full text-lms-text-brand-secondary shadow-lg"
            style={{ background: mix("--lms-bg-primary", 90) }}
          >
            <Icon icon={playing ? Pause : Play} size={28} />
          </span>
        </button>
      ) : (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 text-center"
          style={{ background: mix("--lms-text-primary", 40) }}
        >
          {state === "loading" ? (
            <>
              <Loader2 size={36} strokeWidth={2} className="animate-spin text-lms-fg-white" />
              <span className="lms-text-sm-medium text-lms-fg-white">Loading video…</span>
            </>
          ) : null}
          {state === "error" ? (
            <>
              <Icon icon={AlertCircle} size={36} className="text-lms-fg-white" />
              <span className="lms-text-sm-medium text-lms-fg-white">
                Couldn’t load this video.
              </span>
              <button
                type="button"
                onClick={onRetry}
                className="lms-text-sm-semibold rounded-md bg-lms-fg-white px-3 py-1.5 text-lms-text-brand-secondary"
              >
                Retry
              </button>
            </>
          ) : null}
          {state === "ended" ? (
            <>
              <span className="lms-text-md-semibold text-lms-fg-white">You’ve finished this video</span>
              <button
                type="button"
                onClick={onReplay}
                className="lms-text-sm-semibold inline-flex items-center gap-1.5 rounded-md bg-lms-fg-white px-3 py-1.5 text-lms-text-brand-secondary"
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
          style={{ background: mix("--lms-text-primary", 70) }}
        >
          <span className="lms-text-sm-medium text-lms-text-primary-on-brand">
            Welcome back. In this unit we look at the product development lifecycle…
          </span>
        </div>
      ) : null}

      {/* Control bar */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 px-4 pb-3 pt-8"
        style={{
          background: `linear-gradient(to top, ${mix("--lms-text-primary", 70)}, transparent)`,
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
            background: `linear-gradient(to right, var(--lms-fg-progress) ${pct}%, var(--lms-bg-tertiary) ${pct}%)`,
          }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="text-lms-fg-white"
            >
              <Icon icon={playing ? Pause : Play} size={20} />
            </button>
            <span className="lms-text-xs-medium text-lms-fg-white">
              {secondsToTs(currentTime)} / {secondsToTs(durationSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
              className="lms-text-xs-semibold rounded px-2 py-1 text-lms-fg-white"
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
                "lms-text-xs-semibold rounded px-2 py-1",
                captions ? "bg-lms-fg-white text-lms-text-brand-secondary" : "text-lms-fg-white",
              )}
              style={captions ? undefined : controlBg}
            >
              CC
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="lms-text-xs-semibold rounded px-2 py-1 text-lms-fg-white"
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
