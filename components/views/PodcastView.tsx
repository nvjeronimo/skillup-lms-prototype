"use client";

import * as React from "react";
import { Headphones } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ResumeBanner } from "@/components/molecules/ResumeBanner";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { getPodcast } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { cn, secondsToTs } from "@/lib/utils";

/**
 * Podcast — the same player as Video. Per the Topic Content Types model this is
 * an Audio asset delivered through the Video XBlock, so the DS Player is the
 * Video player 16:9 with an audio caption, and the completion rule and the
 * transcript/chapter affordances match Video.
 */
export function PodcastView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const podcast = React.useMemo(() => (topic ? getPodcast(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const resumePositions = useLmsStore((s) => s.resumePositions);
  const saveResumePosition = useLmsStore((s) => s.saveResumePosition);
  const clearResumePosition = useLmsStore((s) => s.clearResumePosition);

  const durationSeconds = 1144; // 19:04
  // Start at zero and OFFER the stored position, rather than silently jumping —
  // matching how Video behaves. Same family, same expectation.
  const [t, setT] = React.useState(0);
  const [resumeHandled, setResumeHandled] = React.useState(false);
  const storedResume = resumePositions[topicId];
  const showResume = !resumeHandled && typeof storedResume === "number" && storedResume > 0;

  if (!topic || !podcast) return null;

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

      {/* DS LMS / Podcast · Player (20328:3337) is a Lesson Block Kind=Video (Audio):
          the same Video player 16:9 as a Video topic, plus a caption. */}
      <figure className="flex flex-col gap-2 rounded-xl shadow-sk-card">
        <VideoPlayer durationSeconds={durationSeconds} currentTime={t} onSeek={seek} />
        <figcaption className="sk-text-xs-regular text-sko-text-subtle">
          Podcast episode · {secondsToTs(durationSeconds)} · transcript available
        </figcaption>
      </figure>

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
        <span className="sk-text-sm-medium text-sko-text-muted">
          {podcast.host}
          {podcast.guest ? ` with ${podcast.guest}` : ""}
        </span>
        <p className="sk-text-md-regular text-sko-text-muted">{podcast.summary}</p>
      </div>

      {/* Chapters behave like transcript lines: click to seek. */}
      <section className="flex flex-col gap-2">
        <h2 className="sk-text-md-semibold text-sko-text-default">Chapters</h2>
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
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary",
                    active ? "bg-sko-bg-primary-soft" : "hover:bg-sko-bg-subtle",
                  )}
                >
                  <span
                    className={cn(
                      "sk-text-xs-medium tabular-nums",
                      active ? "text-sko-text-primary" : "text-sko-text-subtle",
                    )}
                  >
                    {c.ts}
                  </span>
                  <span
                    className={cn(
                      "sk-text-sm-regular",
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

      <p className="sk-text-xs-regular text-sko-text-subtle">
        Completes automatically once you have listened to 90%.
      </p>
    </div>
  );
}
