"use client";

import * as React from "react";
import { PLAYBACK_TICK_MS, advancePlayback } from "./coverage";

export interface PlaybackClockOptions {
  playing: boolean;
  /** The current position, in seconds. */
  time: number;
  duration: number;
  /** Playback rate (1 = real time). */
  speed: number;
  /** Time PLAYED from `from` to `to`: the caller moves its playhead and counts coverage. */
  onAdvance: (from: number, to: number) => void;
  /** Playback reached the end. */
  onEnd: () => void;
  /** The tab was hidden while playing: the caller pauses. */
  onHidden: () => void;
}

/**
 * The simulated clock of the prototype's players (they have no media file). While `playing`, every
 * PLAYBACK_TICK_MS it advances the time by the wall time elapsed times `speed` and reports the
 * stretch with `onAdvance`, which is how the players tell played time from a seek (BR-01: only
 * played time counts towards the 90%). It stops at the end and when the tab is hidden.
 */
export function usePlaybackClock({ playing, time, duration, speed, onAdvance, onEnd, onHidden }: PlaybackClockOptions) {
  const latest = React.useRef({ time, duration, speed, onAdvance, onEnd, onHidden });
  latest.current = { ...latest.current, time, duration, speed, onAdvance, onEnd, onHidden };

  React.useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const elapsed = (now - last) / 1000;
      last = now;
      const cur = latest.current;
      const next = advancePlayback(cur.time, elapsed, cur.speed, cur.duration);
      if (next.time > cur.time) {
        const from = cur.time;
        // Ahead of the re-render, so a second tick before it never counts the stretch twice.
        cur.time = next.time;
        cur.onAdvance(from, next.time);
      }
      if (next.ended) cur.onEnd();
    }, PLAYBACK_TICK_MS);
    function onVisibility() {
      if (document.hidden) latest.current.onHidden();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [playing]);
}
