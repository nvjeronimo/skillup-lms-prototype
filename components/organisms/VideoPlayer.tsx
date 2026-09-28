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

/** DS `_Video actions bar` Size. Set by the caller; the bar never re-sizes itself. */
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
   * DS `_Video actions bar` Size. lg = 24/16/16/16 padding, gap 4, with the volume
   * slider, plus skip back/forward when `onSeek` is set. md = 24/12/8/12 padding, gap 2,
   * progress padding 4, no skip or volume; md keeps speed + CC (the DS md variant swaps
   * them for skip + a volume button). Default `auto`: a CSS container query on the
   * player picks lg from 640px of player width (between the DS 560 md and 720 lg
   * frames), so the right bar is there on first paint and never swaps after mount.
   */
  size?: VideoPlayerSize | "auto";
  className?: string;
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];
const SKIP_SECONDS = 10;

/** Translucent surfaces are tokens that carry their own alpha (bg/overlay-soft, bg/on-media-soft, bg/overlay): no color-mix, no layer opacity. */

/** DS `_Video action button`: 32×32, padding 8, radius 6 (Radius/fixed-sm). Layout only. */
const ACTION_LAYOUT = "peer inline-flex h-8 min-w-8 items-center justify-center rounded-md p-2";
/** Colour, Type = icon (Play, Skip, Maximize): 16px icon in icon/on-media. Volume uses VOLUME_TONE. */
const ACTION_ICON = "bg-sko-bg-overlay-soft text-sko-icon-on-media";
/** Colour, Type = Playback speed / Subtitles/CC: body-small/Semibold text/on-media. */
const ACTION_LABEL = "bg-sko-bg-overlay-soft text-sko-text-on-media";
/** State=Hover (only while the button is not active): bg/on-media-soft + backdrop-blur-sm. */
const ACTION_HOVER = "hover:bg-sko-bg-on-media-soft hover:backdrop-blur-sm";
/**
 * DS `_Video volume slider` (9264:575621 rest / 9264:575737 hover): the inner volume
 * button is bg/on-media-soft at rest and bg/overlay-soft while the slider group is
 * hovered, so it stays visible on the group's bg/on-media-soft. Replaces ACTION_ICON +
 * ACTION_HOVER (cn has no tailwind-merge, so the two sets cannot be layered).
 */
const VOLUME_TONE =
  "bg-sko-bg-on-media-soft text-sko-icon-on-media group-hover/vol:bg-sko-bg-overlay-soft";
/** DS volume slider handle: 12px round bg/on-media thumb (WebKit + Firefox). */
const VOLUME_THUMB =
  "[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sko-bg-on-media [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-sko-bg-on-media";
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
  /** Rest + hover colours that replace the kind's defaults (the volume button). */
  tone?: string;
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
  tone,
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
            : tone ?? cn(kind === "label" ? ACTION_LABEL : ACTION_ICON, ACTION_HOVER),
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
  size = "auto",
  className,
}: VideoPlayerProps) {
  const [playing, setPlaying] = React.useState(false);
  const [speedIdx, setSpeedIdx] = React.useState(1);
  const [captions, setCaptions] = React.useState(true);
  const [volume, setVolume] = React.useState(75);
  const [muted, setMuted] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  // Classes per bar size; `auto` switches on the player's own width (container query at
  // 40rem). Written out in full so Tailwind generates them.
  const bar = (md: string, lg: string, auto: string) =>
    size === "lg" ? lg : size === "md" ? md : auto;
  const pct = durationSeconds > 0 ? Math.min(100, (currentTime / durationSeconds) * 100) : 0;
  const audible = muted ? 0 : volume;

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
        size === "auto" && "[container-type:inline-size]",
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
        className={cn("absolute inset-x-0 bottom-0 z-20 pt-6", bar(
            "px-3 pb-2",
            "px-4 pb-4",
            "px-3 pb-2 [@container(min-width:40rem)]:px-4 [@container(min-width:40rem)]:pb-4",
          ))}
        style={{
          background: "linear-gradient(to top, var(--color-bg-overlay), transparent)",
        }}
      >
        <div className={cn("flex items-center", bar("gap-0.5", "gap-1", "gap-0.5 [@container(min-width:40rem)]:gap-1"))}>
          <ActionButton label={playing ? "Pause" : "Play"} onClick={togglePlay} align="start">
            <Icon icon={playing ? Pause : Play} size={16} />
          </ActionButton>
          {size !== "md" ? (
            <div className={cn("items-center gap-1", bar("hidden", "flex", "hidden [@container(min-width:40rem)]:flex"))}>
              {/* Skip ±10s only when the caller can seek: no dead buttons. */}
              {onSeek ? (
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
                </>
              ) : null}
              {/* DS `_Video volume slider`: volume button + 40×4 slider, gap 4, right pad 8. */}
              <div className="group/vol flex shrink-0 items-center gap-1 rounded-md pr-2 hover:bg-sko-bg-on-media-soft hover:backdrop-blur-sm">
                {/* Toggle button: constant name, state carried by aria-pressed. */}
                <ActionButton
                  label="Mute"
                  aria-pressed={audible === 0}
                  tone={VOLUME_TONE}
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
                  className={cn("h-1 w-10 cursor-pointer appearance-none rounded-full", VOLUME_THUMB)}
                  style={{
                    background: `linear-gradient(to right, var(--color-bg-on-media) ${audible}%, var(--color-bg-on-media-soft) ${audible}%)`,
                  }}
                />
              </div>
            </div>
          ) : null}

          {/* DS `Video progress`: timestamp start · slider · timestamp end. Decision 019:
              elapsed / total. tabular-nums keeps the slider from jittering as digits change. */}
          <div className={cn("flex min-w-0 flex-1 items-center gap-2", bar("px-1", "px-2", "px-1 [@container(min-width:40rem)]:px-2"))}>
            <span className="sk-text-xs-semibold shrink-0 whitespace-nowrap tabular-nums text-sko-text-on-media">
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
            <span className="sk-text-xs-semibold shrink-0 whitespace-nowrap tabular-nums text-sko-text-on-media">
              {secondsToTs(durationSeconds)}
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
            tooltip="Subtitles/CC"
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
