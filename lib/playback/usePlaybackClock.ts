"use client";

import * as React from "react";
import { startPlaybackClock, type ClockState } from "./clock";

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
 * The simulated clock of the prototype's players (they have no media file), on `startPlaybackClock`.
 * While `playing`, every PLAYBACK_TICK_MS it advances the time by the wall time elapsed times `speed` and reports the
 * stretch with `onAdvance`, which is how the players tell played time from a seek (BR-01: only
 * played time counts towards the 90%). It stops at the end and when the tab is hidden.
 */
export function usePlaybackClock({ playing, time, duration, speed, onAdvance, onEnd, onHidden }: PlaybackClockOptions) {
  // The clock reads and writes this on every tick; a render carries the caller's time back in
  // (the tick's own value, or a seek).
  const state = React.useRef<ClockState>({ time, speed, duration });
  state.current.time = time;
  state.current.speed = speed;
  state.current.duration = duration;
  const handlers = React.useRef({ onAdvance, onEnd, onHidden });
  handlers.current = { onAdvance, onEnd, onHidden };

  React.useEffect(() => {
    if (!playing) return;
    const stop = startPlaybackClock(
      state.current,
      (from, to) => handlers.current.onAdvance(from, to),
      () => handlers.current.onEnd(),
    );
    function onVisibility() {
      if (document.hidden) handlers.current.onHidden();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [playing]);
}
