"use client";

import * as React from "react";
import {
  AlertCircle,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn, secondsToTs } from "@/lib/utils";
import type { VideoState } from "@/lib/types";

/** DS `_Video actions bar` Size. `md` below 640px of player width when not set. */
export type VideoPlayerSize = "md" | "lg";

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
  /**
   * DS `_Video actions bar` Size. lg = 24/16/16/16 padding, gap 4, with skip + volume slider.
   * md = 24/12/8/12 padding, gap 2, progress padding 4. md keeps speed + CC (the DS md
   * variant swaps them for skip + volume button). Omit to pick from the player's width
   * (lg from 640px).
   */
  size?: VideoPlayerSize;
  className?: string;
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];
const SKIP_SECONDS = 10;
/** Player width from which the lg actions bar fits in one row (DS lg frame is 720). */
const LG_MIN_WIDTH = 640;

/** Translucent surfaces are tokens that carry their own alpha (bg/overlay-soft, bg/on-media-soft, bg/overlay): no color-mix, no layer opacity. */

/** DS `_Video action button`: 32×32, padding 8, radius 6 (Radius/fixed-sm). Layout only. */
const ACTION_LAYOUT = "peer inline-flex h-8 min-w-8 items-center justify-center rounded-md p-2";
/** Colour, Type = icon (Play, Skip, Volume, Maximize): 16px icon in icon/on-media. */
const ACTION_ICON = "bg-sko-bg-overlay-soft text-sko-icon-on-media";
/** Colour, Type = Playback speed / Subtitles/CC: body-small/Semibold text/on-media. */
const ACTION_LABEL = "bg-sko-bg-overlay-soft text-sko-text-on-media";
/** State=Hover (only while the button is not active): bg/on-media-soft + backdrop-blur-sm. */
const ACTION_HOVER = "hover:bg-sko-bg-on-media-soft hover:backdrop-blur-sm";
/**
 * DS Elevation/level4 geometry (2/2/-1, 4/6/-2, 12/16/-4) on the DS shadow colour.
 * The prototype has no elevation tokens yet, so the three layers share --color-shadow-default.
 */
const ELEVATION_LEVEL4 =
  "shadow-[0_2px_2px_-1px_var(--color-shadow-default),0_4px_6px_-2px_var(--color-shadow-default),0_12px_16px_-4px_var(--color-shadow-default)]";

const TOOLTIP_ALIGN = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
} as const;

interface ActionButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Accessible name; also the tooltip text unless `tooltip` is set. */
  label: string;
  tooltip?: string;
  /** Icon (16px, icon/on-media) or text label (Speed / CC). */
  kind?: "icon" | "label";
  /** On-state (CC while captions are on): bg/on-media + text/on-fixed, no hover. */
  active?: boolean;
  /** Tooltip alignment, so the first and last buttons stay inside the player. */
  align?: keyof typeof TOOLTIP_ALIGN;
}

/**
 * DS `_Video action button` + `_Video action tooltip` (Badge=False).
 * The Badge=True variant (keyboard shortcut chip) is not rendered because the player
 * has no keyboard shortcuts yet.
 */
function ActionButton({
  label,
  tooltip = label,
  kind = "icon",
  active = false,
  align = "center",
  className,
  children,
  ...rest
}: ActionButtonProps) {
  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        aria-label={label}
        className={cn(
          ACTION_LAYOUT,
          kind === "label" && "sk-text-xs-semibold",
          active
            ? "bg-sko-bg-on-media text-sko-text-on-fixed"
            : cn(kind === "label" ? ACTION_LABEL : ACTION_ICON, ACTION_HOVER),
          className,
        )}
        {...rest}
      >
        {children}
      </button>
      <span
        aria-hidden
        className={cn(
          "sk-text-sm-semibold pointer-events-none invisible absolute bottom-full mb-2 whitespace-nowrap rounded-lg bg-sko-bg-inverse px-2 py-1 text-sko-text-on-inverse opacity-0 transition-opacity",
          "peer-hover:visible peer-hover:opacity-100 peer-focus-visible:visible peer-focus-visible:opacity-100",
          ELEVATION_LEVEL4,
          TOOLTIP_ALIGN[align],
        )}
      >
        {tooltip}
      </span>
    </span>
  );
}

/**
 * Lightweight video player. Branded gradient placeholder (no real asset needed).
 * Mirrors DS `Video player 16:9` + `_Video actions bar` (9264:576771 / 9264:576129):
 * one row of action buttons around the progress slider, all bound to tokens.
 * Paused: `_Video overlay action` scrim + centred play button. Playing: bar only.
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
  size,
  className,
}: VideoPlayerProps) {
  const [playing, setPlaying] = React.useState(false);
  const [speedIdx, setSpeedIdx] = React.useState(1);
  const [captions, setCaptions] = React.useState(true);
  const [volume, setVolume] = React.useState(75);
  const [muted, setMuted] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  // md fits any width, so it is the safe first paint before the player is measured.
  const [autoSize, setAutoSize] = React.useState<VideoPlayerSize>("md");
  const wrapRef = React.useRef<HTMLDivElement>(null);

  const barSize = size ?? autoSize;
  const isLg = barSize === "lg";
  const pct = durationSeconds > 0 ? Math.min(100, (currentTime / durationSeconds) * 100) : 0;
  const remaining = Math.max(0, durationSeconds - currentTime);
  const audible = muted ? 0 : volume;

  React.useEffect(() => {
    if (size) return;
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      setAutoSize(entry.contentRect.width >= LG_MIN_WIDTH ? "lg" : "md");
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [size]);

  React.useEffect(() => {
    function onChange() {
      setFullscreen(document.fullscreenElement === wrapRef.current);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function togglePlay() {
    setPlaying((p) => !p);
  }

  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    onSeek?.(Number(e.target.value));
  }

  function skip(delta: number) {
    onSeek?.(Math.min(durationSeconds, Math.max(0, currentTime + delta)));
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setVolume(v);
    setMuted(v === 0);
  }

  function toggleFullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }

  const volumeIcon = audible === 0 ? VolumeX : audible < 50 ? Volume1 : Volume2;

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative w-full overflow-hidden bg-sko-bg-primary transition-[height,border-radius,box-shadow] duration-200 ease-out",
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
          ? "0 4px 16px color-mix(in srgb, var(--color-text-default) 18%, transparent)"
          : undefined,
      }}
    >
      {/* Placeholder visual — branded gradient so no real asset is required. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--color-bg-primary), var(--color-text-on-primary-soft))",
        }}
        aria-hidden
      />

      {state === "ready" ? (
        // Full-size click layer toggles play/pause in both states. Only while paused does it
        // carry the DS `_Video overlay action`: bg/overlay-soft scrim + centred 64px button.
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          {!playing ? (
            <>
              <span className="absolute inset-0 bg-sko-bg-overlay-soft" aria-hidden />
              <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-sko-bg-overlay-soft text-sko-icon-on-media backdrop-blur">
                <Icon icon={Play} size={20} />
              </span>
            </>
          ) : null}
        </button>
      ) : (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-sko-bg-overlay text-center"
        >
          {state === "loading" ? (
            <>
              <Loader2 size={36} strokeWidth={2} className="animate-spin text-sko-icon-on-media" />
              <span className="sk-text-sm-medium text-sko-text-on-media">Loading video…</span>
            </>
          ) : null}
          {state === "error" ? (
            <>
              <Icon icon={AlertCircle} size={36} className="text-sko-icon-on-media" />
              <span className="sk-text-sm-medium text-sko-text-on-media">
                Couldn’t load this video.
              </span>
              <button
                type="button"
                onClick={onRetry}
                className="sk-text-sm-semibold rounded-md bg-sko-bg-fixed px-3 py-1.5 text-sko-text-on-fixed"
              >
                Retry
              </button>
            </>
          ) : null}
          {state === "ended" ? (
            <>
              <span className="sk-text-md-semibold text-sko-text-on-media">You’ve finished this video</span>
              <button
                type="button"
                onClick={onReplay}
                className="sk-text-sm-semibold inline-flex items-center gap-1.5 rounded-md bg-sko-bg-fixed px-3 py-1.5 text-sko-text-on-fixed"
              >
                <Icon icon={RotateCcw} size={16} className="text-sko-icon-on-fixed" /> Replay
              </button>
            </>
          ) : null}
        </div>
      )}

      {captions && state === "ready" ? (
        <div
          className="absolute bottom-20 left-1/2 z-10 max-w-[80%] -translate-x-1/2 rounded bg-sko-bg-overlay px-3 py-1 text-center"
        >
          <span className="sk-text-sm-medium text-sko-text-on-media">
            Welcome back. In this unit we look at the product development lifecycle…
          </span>
        </div>
      ) : null}

      {/* DS `_Video actions bar`: one row, lg pad 24/16/16/16 gap 4 · md pad 24/12/8/12 gap 2. */}
      <div
        className={cn("absolute inset-x-0 bottom-0 z-20", isLg ? "px-4 pb-4 pt-6" : "px-3 pb-2 pt-6")}
        style={{
          background: "linear-gradient(to top, var(--color-bg-overlay), transparent)",
        }}
      >
        <div className={cn("flex items-center", isLg ? "gap-1" : "gap-0.5")}>
          <ActionButton label={playing ? "Pause" : "Play"} onClick={togglePlay} align="start">
            <Icon icon={playing ? Pause : Play} size={16} />
          </ActionButton>
          {isLg ? (
            <>
              <ActionButton
                label={`Skip back ${SKIP_SECONDS} seconds`}
                tooltip="Skip back"
                onClick={() => skip(-SKIP_SECONDS)}
              >
                <Icon icon={SkipBack} size={16} />
              </ActionButton>
              <ActionButton
                label={`Skip forward ${SKIP_SECONDS} seconds`}
                tooltip="Skip forward"
                onClick={() => skip(SKIP_SECONDS)}
              >
                <Icon icon={SkipForward} size={16} />
              </ActionButton>
              {/* DS `_Video volume slider`: volume button + 40×4 slider, gap 4, right pad 8. */}
              <div className="flex shrink-0 items-center gap-1 rounded-md pr-2 hover:bg-sko-bg-on-media-soft hover:backdrop-blur-sm">
                <ActionButton
                  label={audible === 0 ? "Unmute" : "Mute"}
                  aria-pressed={audible === 0}
                  onClick={() => {
                    if (audible === 0 && volume === 0) setVolume(75);
                    setMuted(audible !== 0);
                  }}
                >
                  <Icon icon={volumeIcon} size={16} />
                </ActionButton>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={audible}
                  onChange={handleVolume}
                  aria-label="Volume"
                  className="h-1 w-10 cursor-pointer appearance-none rounded-full"
                  style={{
                    background: `linear-gradient(to right, var(--color-bg-on-media) ${audible}%, var(--color-bg-on-media-soft) ${audible}%)`,
                  }}
                />
              </div>
            </>
          ) : null}

          {/* DS `Video progress`: timestamp start · slider · timestamp end (remaining). */}
          <div className={cn("flex min-w-0 flex-1 items-center gap-2", isLg ? "px-2" : "px-1")}>
            <span className="sk-text-xs-semibold shrink-0 whitespace-nowrap text-sko-text-on-media">
              {secondsToTs(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={durationSeconds}
              value={currentTime}
              onChange={handleScrub}
              aria-label="Seek"
              aria-valuetext={`${secondsToTs(currentTime)} of ${secondsToTs(durationSeconds)}`}
              className="h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full backdrop-blur-sm"
              style={{
                background: `linear-gradient(to right, var(--color-bg-info) ${pct}%, var(--color-bg-on-media-soft) ${pct}%)`,
              }}
            />
            <span className="sk-text-xs-semibold shrink-0 whitespace-nowrap text-sko-text-on-media">
              -{secondsToTs(remaining)}
            </span>
          </div>

          <ActionButton
            kind="label"
            label="Playback speed"
            onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
          >
            {SPEEDS[speedIdx]}×
          </ActionButton>
          <ActionButton
            kind="label"
            label="Toggle captions"
            tooltip={captions ? "Captions off" : "Captions on"}
            active={captions}
            aria-pressed={captions}
            onClick={() => setCaptions((c) => !c)}
          >
            CC
          </ActionButton>
          <ActionButton
            label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={toggleFullscreen}
            align="end"
          >
            <Icon icon={fullscreen ? Minimize2 : Maximize2} size={16} />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
