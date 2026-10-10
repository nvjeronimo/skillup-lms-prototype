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
  X,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn, secondsToTs, tsToSeconds } from "@/lib/utils";
import type { TranscriptLine, VideoState } from "@/lib/types";

/** DS `_Video actions bar` Size. Set by the caller; the bar never re-sizes itself. */
export type VideoPlayerSize = "sm" | "md" | "lg";

export interface VideoPlayerProps {
  src?: string;
  /** Total duration in seconds (for the placeholder scrubber). */
  durationSeconds?: number;
  /** Controlled current time. */
  currentTime?: number;
  onSeek?: (seconds: number) => void;
  /**
   * Caption cues: the transcript lines of the topic. The overlay prints the line for the
   * current time (the first line before it starts). None, or left out: no caption overlay.
   */
  captions?: Pick<TranscriptLine, "ts" | "text">[];
  /** Lifecycle state for edge-case rendering: ready · loading · error · ended. */
  state?: VideoState;
  onRetry?: () => void;
  onReplay?: () => void;
  /** Explicit pixel height (sticky docking). Animates between full + docked heights. */
  heightPx?: number;
  /** Docked (scrolled) treatment: drop shadow + bottom-only corners. */
  docked?: boolean;
  /**
   * DS `_Video actions bar` Size (9264:576129), one row in the DS order:
   * - lg: padding 3xl/16/16/16, gap 4. Play · Skip back · Skip forward · Volume slider ·
   *   progress (padding 8) · Speed · CC · Maximize.
   * - md: padding 3xl/12/8/12, gap 2. The volume is a button (mute) without the slider and
   *   the progress padding is 4.
   * - sm: padding 8/4/4/4, gap 2. Play · Volume on the left, Skip back · Skip forward ·
   *   Maximize on the right.
   * Two things the DS md and sm variants do not draw are kept: Speed and CC (before
   * Maximize, as on lg), and on sm the progress slider, on a row of its own above the
   * buttons, so a phone can still scrub.
   * Default `auto`: CSS container queries on the player pick md from 480px and lg from
   * 640px of player width (the DS frames are 240 to 343 sm, 560 to 600 md, 720 and up lg),
   * so the right bar is there on first paint and never swaps after mount. `md` never grows
   * to lg, and falls back to sm below 480px, where its row does not fit.
   */
  size?: VideoPlayerSize | "auto";
  className?: string;
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];
const SKIP_SECONDS = 10;
/** Drops the lg (40rem) container-query classes of an `auto` class list. */
const withoutLg = (classes: string) =>
  classes
    .split(" ")
    .filter((c) => !c.startsWith("[@container(min-width:40rem)]"))
    .join(" ");
/** DS timestamps are two-digit minutes ("00:00", "08:24"). */
const clock = (seconds: number) => secondsToTs(seconds).padStart(5, "0");
/** A caption is one short line: a longer transcript line is cut at a word and ends with "…". */
const CAPTION_MAX = 72;

/** The cue for the current time: the last line that has started, or the first one. */
function captionAt(cues: Pick<TranscriptLine, "ts" | "text">[], seconds: number): string | null {
  if (cues.length === 0) return null;
  let line = cues[0];
  for (const cue of cues) {
    if (tsToSeconds(cue.ts) <= seconds) line = cue;
  }
  if (line.text.length <= CAPTION_MAX) return line.text;
  const cut = line.text.lastIndexOf(" ", CAPTION_MAX);
  return `${line.text.slice(0, cut > 0 ? cut : CAPTION_MAX).replace(/[,;:]$/, "")}…`;
}

/** Translucent surfaces are tokens that carry their own alpha (bg/overlay-soft, bg/on-media-soft, bg/overlay): no color-mix, no layer opacity. */

/**
 * DS `_Video action button`: 32×32, padding 8, radius 6 (Radius/fixed-sm). Layout only.
 * With larger touch targets on (the mobile default) the button stays 32×32, as the note on
 * the mobile frames asks: a pseudo-element extends the hit area to 44 high (8 above, 4
 * below, which is the sm bar's own padding) and by 1px on each side, half the 2px gap, so
 * two neighbours never overlap.
 */
const ACTION_LAYOUT =
  "peer relative inline-flex h-8 min-w-8 items-center justify-center rounded-md p-2 [[data-large-targets]_&]:min-h-8 [[data-large-targets]_&]:min-w-8 [[data-large-targets]_&]:before:absolute [[data-large-targets]_&]:before:-inset-x-px [[data-large-targets]_&]:before:-bottom-1 [[data-large-targets]_&]:before:-top-2 [[data-large-targets]_&]:before:content-['']";
/**
 * The DS bar uses the Solid icons (play, pause, skip-back, skip-forward, volume-max): the
 * closed shape of the lucide glyph is filled, the open strokes (volume waves) stay lines.
 */
const SOLID = "[&>path:first-child]:fill-current [&>polygon]:fill-current [&>rect]:fill-current";
/** Colour, Type = icon (Play, Skip, Maximize): 16px icon in icon/on-media. Volume uses VOLUME_TONE. */
const ACTION_ICON = "bg-sko-bg-overlay-soft text-sko-icon-on-media";
/** Colour, Type = Playback speed / Subtitles/CC: body-small/Semibold text/on-media. */
const ACTION_LABEL = "bg-sko-bg-overlay-soft text-sko-text-on-media";
/** State=Hover (only while the button is not active): bg/on-media-soft + backdrop-blur-sm. */
const ACTION_HOVER = "hover:bg-sko-bg-on-media-soft hover:backdrop-blur-sm";
/**
 * DS `_Video volume slider` (9264:575621 rest / 9264:575737 hover), lg only: on hover the
 * whole group takes bg/on-media-soft and the inner volume button keeps bg/overlay-soft, so
 * the button has no hover colour of its own. At rest the button is bg/overlay-soft like
 * every other action: that is what the ready-for-dev screens show (the DS component draws
 * it bg/on-media-soft at rest; the screens override it).
 */
const VOLUME_TONE_GROUP = "bg-sko-bg-overlay-soft text-sko-icon-on-media";
/** The same button under a container query: its own hover below lg, the group's from lg. */
const VOLUME_TONE_AUTO =
  "bg-sko-bg-overlay-soft text-sko-icon-on-media hover:bg-sko-bg-on-media-soft hover:backdrop-blur-sm [@container(min-width:40rem)]:hover:bg-sko-bg-overlay-soft [@container(min-width:40rem)]:hover:backdrop-blur-none";
/**
 * DS `Progress slider`: no handle, the 8px bg/on-media line is its own end (an 8px dot at
 * 00:00). The thumb is that end: 8px, round, bg/on-media.
 */
const SEEK_THUMB =
  "[&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sko-bg-on-media [&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-sko-bg-on-media";
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
  /** Classes for the wrapper, which is the flex item of the bar (its `order` on sm). */
  wrapClassName?: string;
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
  wrapClassName,
  className,
  children,
  ...rest
}: ActionButtonProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", wrapClassName)}>
      <button
        type="button"
        aria-label={label}
        className={cn(
          ACTION_LAYOUT,
          // Speed and CC are 32 wide in the DS: 4 of side padding lets "CC" and "1×" fit in
          // the 32 minimum, and a longer speed ("1.25×") still grows the button.
          kind === "label" && "sk-text-body-small-semibold px-1",
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
          "sk-text-body-medium-semibold pointer-events-none invisible absolute bottom-full mb-2 whitespace-nowrap rounded-lg bg-sko-bg-inverse px-2 py-1 text-sko-text-on-inverse opacity-0 transition-opacity",
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
  currentTime: controlledTime = 0,
  onSeek,
  captions: cues,
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
  // Without `onSeek` the player keeps its own position, so the slider and the skip buttons
  // (which the DS bar shows at every size) work wherever the player is dropped in.
  const [ownTime, setOwnTime] = React.useState(controlledTime);
  const currentTime = onSeek ? controlledTime : ownTime;
  const wrapRef = React.useRef<HTMLDivElement>(null);

  // Classes per size of the action bar, which has three. `auto` is written sm first, then md
  // from 30rem and lg from 40rem of player width. `md` is `auto` without its lg classes: the
  // md row needs 480px, so a forced md player falls back to sm on a phone.
  const pick = (sm: string, lg: string, auto: string) =>
    size === "lg" ? lg : size === "sm" ? sm : size === "md" ? withoutLg(auto) : auto;
  const pct = durationSeconds > 0 ? Math.min(100, (currentTime / durationSeconds) * 100) : 0;
  const audible = muted ? 0 : volume;
  const caption = cues ? captionAt(cues, currentTime) : null;

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

  function seekTo(seconds: number) {
    if (onSeek) onSeek(seconds);
    else setOwnTime(seconds);
  }

  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    seekTo(Number(e.target.value));
  }

  function skip(delta: number) {
    seekTo(Math.min(durationSeconds, Math.max(0, currentTime + delta)));
  }

  function toggleMute() {
    if (audible === 0 && volume === 0) setVolume(75);
    setMuted(audible !== 0);
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
        (size === "auto" || size === "md") && "[container-type:inline-size]",
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
              <span className="sk-text-body-medium-medium text-sko-text-on-media">Loading video…</span>
            </>
          ) : null}
          {state === "error" ? (
            <>
              <Icon icon={AlertCircle} size={36} className="text-sko-icon-on-media" />
              <span className="sk-text-body-medium-medium text-sko-text-on-media">
                Couldn’t load this video.
              </span>
              <button
                type="button"
                onClick={onRetry}
                className="sk-text-body-medium-semibold rounded-md bg-sko-bg-fixed px-3 py-1.5 text-sko-text-on-fixed"
              >
                Retry
              </button>
            </>
          ) : null}
          {state === "ended" ? (
            <>
              <span className="sk-text-body-large-semibold text-sko-text-on-media">You’ve finished this video</span>
              <button
                type="button"
                onClick={onReplay}
                className="sk-text-body-medium-semibold inline-flex items-center gap-1.5 rounded-md bg-sko-bg-fixed px-3 py-1.5 text-sko-text-on-fixed"
              >
                <Icon icon={RotateCcw} size={16} className="text-sko-icon-on-fixed" /> Replay
              </button>
            </>
          ) : null}
        </div>
      )}

      {captions && caption && state === "ready" ? (
        <div
          className={cn(
            // Centred with auto margins, not left-1/2: that halves the width the text can
            // use and wraps the caption into a column that a short player clips.
            // pointer-events-none: on sm the caption sits over the seek slider's taller touch area.
            "pointer-events-none absolute inset-x-0 z-10 mx-auto w-fit max-w-[94%] overflow-hidden rounded bg-sko-bg-overlay text-center",
            // Sits just above the action bar: 70 tall on sm, at most 72 on md and lg since the bar
            // follows the DS. At the old 112 a wrapped caption left the top of a short phone player.
            pick("bottom-[74px]", "bottom-20", "bottom-[74px] [@container(min-width:30rem)]:bottom-20"),
          )}
        >
          {/* Two bg/overlay layers (50% each, 75% together): one layer leaves white text
              at about 3.4:1 over a bright frame; two keep it above 4.5:1 on any video. */}
          <span className="sk-text-body-medium-medium block bg-sko-bg-overlay px-3 py-1 text-sko-text-on-media">
            {caption}
          </span>
        </div>
      ) : null}

      {/* DS `_Video actions bar` (9264:576129), one row. Padding: lg 3xl/16/16/16, md
          3xl/12/8/12, sm 8/4/4/4. Spacing/3xl is mode-aware (24 desktop, 20 tablet, 16
          mobile), so the top padding follows the viewport through --vab-top. */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 [--vab-top:1rem] min-[769px]:[--vab-top:1.25rem] min-[1025px]:[--vab-top:1.5rem]",
          pick(
            "px-1 pb-1 pt-2",
            "px-4 pb-4 pt-[var(--vab-top)]",
            "px-1 pb-1 pt-2 [@container(min-width:30rem)]:px-3 [@container(min-width:30rem)]:pb-2 [@container(min-width:30rem)]:pt-[var(--vab-top)] [@container(min-width:40rem)]:px-4 [@container(min-width:40rem)]:pb-4",
          ),
        )}
        style={{
          background: "linear-gradient(to top, var(--color-bg-overlay), transparent)",
        }}
      >
        {/* Content: gap 4 on lg, 2 on md and sm. On sm the row wraps once: the progress
            takes the first line (8 above the buttons, which is the height their touch area
            reaches), and `order` puts Volume next to Play and the rest on the right. */}
        <div
          className={cn(
            "flex items-center",
            pick(
              "flex-wrap gap-x-0.5 gap-y-2",
              "gap-1",
              "flex-wrap gap-x-0.5 gap-y-2 [@container(min-width:30rem)]:flex-nowrap [@container(min-width:40rem)]:gap-x-1",
            ),
          )}
        >
          <ActionButton label={playing ? "Pause" : "Play"} onClick={togglePlay} align="start">
            <Icon icon={playing ? Pause : Play} size={16} className={SOLID} />
          </ActionButton>
          <ActionButton
            label={`Skip back ${SKIP_SECONDS} seconds`}
            tooltip="Skip back"
            onClick={() => skip(-SKIP_SECONDS)}
            wrapClassName={pick("order-2", "", "order-2 [@container(min-width:30rem)]:order-none")}
          >
            <Icon icon={SkipBack} size={16} className={SOLID} />
          </ActionButton>
          <ActionButton
            label={`Skip forward ${SKIP_SECONDS} seconds`}
            tooltip="Skip forward"
            onClick={() => skip(SKIP_SECONDS)}
            wrapClassName={pick("order-2", "", "order-2 [@container(min-width:30rem)]:order-none")}
          >
            <Icon icon={SkipForward} size={16} className={SOLID} />
          </ActionButton>
          {/* lg: DS `_Video volume slider`, volume button + 40×4 slider, gap 4, right pad 8.
              md and sm: the volume button alone (it mutes). */}
          <div
            className={cn(
              "group/vol flex shrink-0 items-center rounded-md",
              pick(
                "",
                "gap-1 pr-2 hover:bg-sko-bg-on-media-soft hover:backdrop-blur-sm",
                "[@container(min-width:40rem)]:gap-1 [@container(min-width:40rem)]:pr-2 [@container(min-width:40rem)]:hover:bg-sko-bg-on-media-soft [@container(min-width:40rem)]:hover:backdrop-blur-sm",
              ),
            )}
          >
            {/* Toggle button: constant name, state carried by aria-pressed. */}
            <ActionButton
              label="Mute"
              aria-pressed={audible === 0}
              tone={pick(cn(ACTION_ICON, ACTION_HOVER), VOLUME_TONE_GROUP, VOLUME_TONE_AUTO)}
              onClick={toggleMute}
            >
              <Icon icon={volumeIcon} size={16} className={SOLID} />
            </ActionButton>
            <input
              type="range"
              min={0}
              max={100}
              value={audible}
              onChange={handleVolume}
              aria-label="Volume"
              // 4px track inside a 24px hit area, as on Seek.
              className={cn(
                "box-content h-1 w-10 cursor-pointer appearance-none rounded-full bg-transparent bg-clip-content py-2.5",
                VOLUME_THUMB,
                pick("hidden", "", "hidden [@container(min-width:40rem)]:block"),
              )}
              style={{
                backgroundImage: `linear-gradient(to right, var(--color-bg-on-media) ${audible}%, var(--color-bg-on-media-soft) ${audible}%)`,
              }}
            />
          </div>

          {/* DS `Video progress`: timestamp start · slider · timestamp end, gap 8, padding 8
              on lg and 4 on md. Decision 019: elapsed / total (the DS draws the time left,
              "-08:24"). tabular-nums keeps the slider from jittering as digits change. */}
          <div
            className={cn(
              "flex min-w-0 items-center gap-2",
              pick(
                "order-first basis-full px-1",
                "flex-1 px-2",
                "order-first basis-full px-1 [@container(min-width:30rem)]:order-none [@container(min-width:30rem)]:flex-1 [@container(min-width:30rem)]:basis-0 [@container(min-width:40rem)]:px-2",
              ),
            )}
          >
            <span className="sk-text-body-small-semibold shrink-0 whitespace-nowrap tabular-nums text-sko-text-on-media">
              {clock(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={durationSeconds}
              value={currentTime}
              onChange={handleScrub}
              aria-label="Seek"
              aria-valuetext={`${secondsToTs(currentTime)} of ${secondsToTs(durationSeconds)}`}
              // 8px track inside a 24px hit area (WCAG 2.5.8): the padding is part of the
              // target, the gradient is clipped to the content box. The negative margins
              // take the padding back out of the layout, so the bar keeps the DS height.
              // md and lg: 24 high, or 44 with larger touch targets on (the mobile
              // default), centred on the row. sm: always 44, and all of it above the
              // track's own line, so it never reaches the buttons under it.
              className={cn(
                // bg-transparent: a range input is white by default, which hid the unplayed part
                // of the track (bg/on-media-soft is translucent).
                "box-content h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-transparent bg-clip-content",
                SEEK_THUMB,
                pick(
                  "-mt-[26px] pb-[5px] pt-[31px]",
                  "py-2 [[data-large-targets]_&]:-my-1.5 [[data-large-targets]_&]:py-[18px]",
                  "-mt-[26px] pb-[5px] pt-[31px] [@container(min-width:30rem)]:mt-0 [@container(min-width:30rem)]:py-2 [@container(min-width:30rem)]:[[data-large-targets]_&]:-my-1.5 [@container(min-width:30rem)]:[[data-large-targets]_&]:py-[18px]",
                ),
              )}
              style={{
                backgroundImage: `linear-gradient(to right, var(--color-bg-on-media) ${pct}%, var(--color-bg-on-media-soft) ${pct}%)`,
              }}
            />
            <span className="sk-text-body-small-semibold shrink-0 whitespace-nowrap tabular-nums text-sko-text-on-media">
              {clock(durationSeconds)}
            </span>
          </div>

          {/* sm: the DS `Actions` frame grows, which sends the next buttons to the right. */}
          <span
            aria-hidden
            className={pick("order-1 flex-1", "hidden", "order-1 flex-1 [@container(min-width:30rem)]:hidden")}
          />
          <ActionButton
            kind="label"
            // Name contains the visible speed (WCAG 2.5.3 label in name).
            label={`Playback speed, ${SPEEDS[speedIdx]}×`}
            tooltip="Playback speed"
            onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
            wrapClassName={pick("order-3", "", "order-3 [@container(min-width:30rem)]:order-none")}
          >
            {/* DS Type=Playback speed: the number, then the 8px `playback-x` icon (1.5 stroke). */}
            {SPEEDS[speedIdx]}
            <Icon icon={X} size={8} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
          </ActionButton>
          <ActionButton
            kind="label"
            label="CC, subtitles"
            tooltip="Subtitles/CC"
            active={captions}
            aria-pressed={captions}
            onClick={() => setCaptions((c) => !c)}
            wrapClassName={pick("order-3", "", "order-3 [@container(min-width:30rem)]:order-none")}
          >
            CC
          </ActionButton>
          <ActionButton
            label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={toggleFullscreen}
            align="end"
            wrapClassName={pick("order-3", "", "order-3 [@container(min-width:30rem)]:order-none")}
          >
            <Icon icon={fullscreen ? Minimize2 : Maximize2} size={16} />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
