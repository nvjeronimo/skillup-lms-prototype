"use client";

import * as React from "react";
import { Play, Pause, SkipBack, SkipForward, Headphones, Download } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ResumeBanner } from "@/components/molecules/ResumeBanner";
import { getPodcast } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { cn, secondsToTs } from "@/lib/utils";
import { usePlaybackClock } from "@/lib/playback/usePlaybackClock";
import { usePlaybackRecorder } from "@/lib/playback/usePlaybackRecorder";
import { track } from "@/lib/analytics";

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

/**
 * Podcast — the same chrome as Video with the video surface replaced by a
 * waveform. Per the Topic Content Types model this is an Audio asset, so the
 * completion rule and the transcript/chapter affordances match Video: measured playback
 * completes the topic at 90% played (BR-01 "Audio reaches ≥ 90%", P1-46).
 */
export function PodcastView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const podcast = React.useMemo(() => (topic ? getPodcast(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const showToast = useLmsStore((s) => s.showToast);
  const resumePositions = useLmsStore((s) => s.resumePositions);
  const saveResumePosition = useLmsStore((s) => s.saveResumePosition);
  const clearResumePosition = useLmsStore((s) => s.clearResumePosition);
  // The demo menu ("Mark 85% watched") moves the playhead through the store's timestamp; the
  // podcast keeps its own time otherwise, so only a jump after mount is followed. `seekSeq`
  // changes on every jump, so the same 85% pressed twice applies twice.
  const storePlayhead = useLmsStore((s) => s.currentVideoTimestamp);
  const seekSeq = useLmsStore((s) => s.seekSeq);
  const mountedSeq = React.useRef<number | null>(seekSeq);

  const [playing, setPlaying] = React.useState(false);
  const [speedIdx, setSpeedIdx] = React.useState(1);
  // Start at zero and OFFER the stored position, rather than silently jumping —
  // matching how Video behaves. Same family, same expectation.
  const [t, setT] = React.useState(0);
  const [resumeHandled, setResumeHandled] = React.useState(false);
  const storedResume = resumePositions[topicId];
  const showResume = !resumeHandled && typeof storedResume === "number" && storedResume > 0;
  const durationSeconds = podcast?.durationSeconds ?? 0;
  // Played time goes to the store in a few writes, not on every tick.
  const playback = usePlaybackRecorder(topicId, durationSeconds);
  const playEvent = { topicId, topicType: "podcast" };

  React.useEffect(() => {
    if (mountedSeq.current === seekSeq) return;
    mountedSeq.current = null;
    setT(Math.max(0, Math.min(durationSeconds, storePlayhead)));
  }, [seekSeq, storePlayhead, durationSeconds]);

  function stop(seconds: number, ended = false) {
    setPlaying(false);
    playback.flush();
    // At the end there is nothing to resume: the next visit starts at 00:00.
    if (ended) clearResumePosition(topicId);
    else saveResumePosition(topicId, seconds);
    track(ended ? "video_complete" : "video_pause", { ...playEvent, at: seconds });
  }
  // The simulated clock (no audio file): advances while playing, at the selected speed. Played
  // time counts towards the 90% (recordPlayback); a seek does not.
  usePlaybackClock({
    playing,
    time: t,
    duration: durationSeconds,
    speed: SPEEDS[speedIdx],
    onAdvance: (from, to) => {
      setT(to);
      playback.advance(from, to);
    },
    onEnd: () => stop(durationSeconds, true),
    onHidden: () => stop(t),
  });
  const stopOnUnmount = React.useRef<() => void>(() => {});
  stopOnUnmount.current = () => {
    if (!playing) return;
    playback.flush();
    saveResumePosition(topicId, t);
  };
  React.useEffect(() => () => stopOnUnmount.current(), []);

  if (!topic || !podcast) return null;
  const pct = Math.min(100, (t / durationSeconds) * 100);

  function togglePlay() {
    if (playing) {
      stop(t);
      return;
    }
    // Play at the end starts again from the top: a restart, not a seek.
    const restart = t >= durationSeconds;
    if (restart) {
      setT(0);
      track("video_restart", { topicId, from: durationSeconds });
    }
    // Pressing Play answers the resume banner: it must not reappear as the position saves.
    setResumeHandled(true);
    setPlaying(true);
    track("video_play", { ...playEvent, at: restart ? 0 : t });
  }

  function seek(next: number) {
    const clamped = Math.max(0, Math.min(durationSeconds, next));
    setT(clamped);
    saveResumePosition(topicId, clamped);
  }

  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand" leftIcon={Headphones}>
          Podcast
        </Badge>
        <Badge tone="neutral">{podcast.episodeLabel}</Badge>
      </div>

      {/* Audio surface — a waveform stands in for the video frame. */}
      <section className="flex flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5">
        {/* A flat brand tint (no gradients: they are not part of the SkillUp brand, Nelson 21 Oct 2026). */}
        <div className="flex h-24 items-end gap-[3px] overflow-hidden rounded-control bg-sko-bg-primary-soft px-4 py-3" aria-hidden>
          {Array.from({ length: 64 }).map((_, i) => {
            // Deterministic pseudo-waveform so it never shifts between renders.
            const h = 20 + ((i * 37) % 60);
            const played = (i / 64) * 100 <= pct;
            return (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-inner",
                  // Progress fill is bg/info, never bg/primary; the unplayed track is bg/muted.
                  played ? "bg-sko-bg-info" : "bg-sko-bg-track",
                )}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>

        {/* Scrubber + controls, mirroring the video player's control set. */}
        <input
          type="range"
          min={0}
          max={durationSeconds}
          value={t}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
          aria-valuetext={`${secondsToTs(t)} of ${secondsToTs(durationSeconds)}`}
          // With larger touch targets on (the mobile default) the slider is 44 high.
          className="w-full accent-[var(--color-bg-info)] [[data-large-targets]_&]:min-h-[44px]"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              aria-label="Back 15s"
              leftIcon={SkipBack}
              onClick={() => seek(t - 15)}
            >
              15s
            </Button>
            <Button
              variant="primary"
              size="sm"
              aria-label={playing ? "Pause" : "Play"}
              leftIcon={playing ? Pause : Play}
              onClick={togglePlay}
            >
              {playing ? "Pause" : "Play"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              aria-label="Forward 15s"
              rightIcon={SkipForward}
              onClick={() => seek(t + 15)}
            >
              15s
            </Button>
            <span className="sk-text-body-small-regular ml-1 text-sko-text-subtle">
              {secondsToTs(t)} / {secondsToTs(durationSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              aria-label={`Playback speed, ${SPEEDS[speedIdx]}×`}
              onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
            >
              {SPEEDS[speedIdx]}×
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={Download}
              onClick={() => showToast("Downloading episode audio…")}
            >
              Audio
            </Button>
          </div>
        </div>
      </section>

      {showResume ? (
        <ResumeBanner
          seconds={storedResume}
          onResume={() => {
            setT(storedResume);
            setResumeHandled(true);
          }}
          onStartOver={() => {
            setT(0);
            clearResumePosition(topicId);
            setResumeHandled(true);
          }}
        />
      ) : null}

      <div className="flex flex-col gap-1">
        <span className="sk-text-body-medium-medium text-sko-text-muted">
          {podcast.host}
          {podcast.guest ? ` with ${podcast.guest}` : ""}
        </span>
        <p className="sk-text-body-large-regular text-sko-text-muted">{podcast.summary}</p>
      </div>

      {/* Chapters behave like transcript lines: click to seek. */}
      <section className="flex flex-col gap-2">
        <h2 className="sk-text-body-large-semibold text-sko-text-default">Chapters</h2>
        <ul className="flex flex-col gap-1">
          {podcast.chapters.map((c) => {
            const [m, sec] = c.ts.split(":").map(Number);
            const at = m * 60 + sec;
            const active = t >= at;
            return (
              <li key={c.ts}>
                <button
                  type="button"
                  onClick={() => seek(at)}
                  className={cn(
                    "flex w-full items-baseline gap-3 rounded-control px-3 py-2 text-left transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary",
                    active ? "bg-sko-bg-primary-soft" : "hover:bg-sko-bg-subtle",
                  )}
                >
                  <span
                    className={cn(
                      "sk-text-body-small-medium tabular-nums",
                      active ? "text-sko-text-primary" : "text-sko-text-subtle",
                    )}
                  >
                    {c.ts}
                  </span>
                  <span
                    className={cn(
                      "sk-text-body-medium-regular",
                      active ? "text-sko-text-primary" : "text-sko-text-default",
                    )}
                  >
                    {c.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* No "completes at 90%" line and no Mark as Complete: the podcast completes by itself once
          90% has been played, and the toast says so (BR-01; the button only when playback isn't
          measured, Nelson 21 Oct 2026). */}
    </div>
  );
}
