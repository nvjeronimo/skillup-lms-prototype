"use client";

import * as React from "react";
import { Play, Pause, SkipBack, SkipForward, Headphones, Download } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { getPodcast } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { cn, secondsToTs } from "@/lib/utils";

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

/**
 * Podcast — the same chrome as Video with the video surface replaced by a
 * waveform. Per the Topic Content Types model this is an Audio asset, so the
 * completion rule and the transcript/chapter affordances match Video.
 */
export function PodcastView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const podcast = React.useMemo(() => (topic ? getPodcast(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const showToast = useLmsStore((s) => s.showToast);
  const resumePositions = useLmsStore((s) => s.resumePositions);
  const saveResumePosition = useLmsStore((s) => s.saveResumePosition);

  const durationSeconds = 1144; // 19:04
  const [playing, setPlaying] = React.useState(false);
  const [speedIdx, setSpeedIdx] = React.useState(1);
  const [t, setT] = React.useState(() => resumePositions[topicId] ?? 0);

  if (!topic || !podcast) return null;
  const pct = Math.min(100, (t / durationSeconds) * 100);

  function seek(next: number) {
    const clamped = Math.max(0, Math.min(durationSeconds, next));
    setT(clamped);
    saveResumePosition(topicId, clamped);
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand" leftIcon={Headphones}>
          Podcast
        </Badge>
        <Badge tone="neutral">{podcast.episodeLabel}</Badge>
      </div>

      {/* Audio surface — a waveform stands in for the video frame. */}
      <section className="flex flex-col gap-4 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5">
        <div
          className="flex h-24 items-end gap-[3px] overflow-hidden rounded-lg px-4 py-3"
          style={{
            background: "linear-gradient(135deg, var(--sk-bg-brand-section), var(--sk-bg-secondary))",
          }}
          aria-hidden
        >
          {Array.from({ length: 64 }).map((_, i) => {
            // Deterministic pseudo-waveform so it never shifts between renders.
            const h = 20 + ((i * 37) % 60);
            const played = (i / 64) * 100 <= pct;
            return (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-sm",
                  played ? "bg-sk-bg-brand-solid" : "bg-sk-border-primary",
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
          className="w-full accent-[var(--sk-bg-brand-solid)]"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              aria-label="Back 15 seconds"
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
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? "Pause" : "Play"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              aria-label="Forward 15 seconds"
              rightIcon={SkipForward}
              onClick={() => seek(t + 15)}
            >
              15s
            </Button>
            <span className="sk-text-xs-regular ml-1 text-sk-text-tertiary">
              {secondsToTs(t)} / {secondsToTs(durationSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
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

      <div className="flex flex-col gap-1">
        <span className="sk-text-sm-medium text-sk-text-secondary">
          {podcast.host}
          {podcast.guest ? ` with ${podcast.guest}` : ""}
        </span>
        <p className="sk-text-md-regular text-sk-text-secondary">{podcast.summary}</p>
      </div>

      {/* Chapters behave like transcript lines: click to seek. */}
      <section className="flex flex-col gap-2">
        <h2 className="sk-text-md-semibold text-sk-text-primary">Chapters</h2>
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
                    "flex w-full items-baseline gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-border-brand",
                    active ? "bg-sk-bg-brand-section" : "hover:bg-sk-bg-secondary",
                  )}
                >
                  <span
                    className={cn(
                      "sk-text-xs-medium tabular-nums",
                      active ? "text-sk-text-brand-secondary" : "text-sk-text-tertiary",
                    )}
                  >
                    {c.ts}
                  </span>
                  <span
                    className={cn(
                      "sk-text-sm-regular",
                      active ? "text-sk-text-brand-secondary" : "text-sk-text-primary",
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

      <p className="sk-text-xs-regular text-sk-text-tertiary">
        Completes automatically once you have listened to 90%.
      </p>
    </div>
  );
}
