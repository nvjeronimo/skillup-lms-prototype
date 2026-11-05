"use client";

import * as React from "react";
import { PLAYBACK_TICK_MS } from "./coverage";

/** The part of YouTube's IFrame Player API the prototype uses. */
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getPlayerState(): number;
  setPlaybackRate(rate: number): void;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    options: {
      host?: string;
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
        onError?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const ENDED = 0;
/** A step between two reads longer than this is a seek, not playback (it is never counted). */
const MAX_PLAYED_STEP = 2;

let apiPromise: Promise<YTNamespace> | null = null;
/** Loads https://www.youtube.com/iframe_api once per page. */
function loadApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT!);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

export interface YouTubePlayerOptions {
  /** The YouTube video id. Left out: no player (the hook does nothing). */
  videoId?: string;
  /** Where YouTube puts its iframe. */
  hostRef: React.RefObject<HTMLDivElement | null>;
  playing: boolean;
  speed: number;
  /** 0–100. */
  volume: number;
  muted: boolean;
  /** Changes on every jump by the learner or the caller, with the position to jump to. */
  seek: { to: number; key: number };
  /** Time PLAYED, read from YouTube's own player: the stretch from `from` to `to`. */
  onAdvance: (from: number, to: number) => void;
  /** YouTube's position moved without playing (a seek landed, or a jump we did not count). */
  onPosition: (seconds: number) => void;
  onEnd: () => void;
  /** The video cannot play (removed, private, embedding refused). */
  onError: () => void;
}

/**
 * A YouTube video inside our player (ICP Video Lessons row 10: a Video component with a YouTube
 * ID). YouTube's IFrame Player API with its own controls off: our bar drives it, and the time
 * comes from YouTube's player, read every PLAYBACK_TICK_MS while playing. A step of up to 2 s is
 * played time and goes to `onAdvance` (BR-01 coverage, 90% completes the topic); a longer one is
 * a seek and only moves the position. youtube-nocookie.com, so YouTube sets no cookie until play.
 */
export function useYouTubePlayer({
  videoId,
  hostRef,
  playing,
  speed,
  volume,
  muted,
  seek,
  onAdvance,
  onPosition,
  onEnd,
  onError,
}: YouTubePlayerOptions) {
  const player = React.useRef<YTPlayer | null>(null);
  const [ready, setReady] = React.useState(false);
  const handlers = React.useRef({ onAdvance, onPosition, onEnd, onError });
  handlers.current = { onAdvance, onPosition, onEnd, onError };
  const initial = React.useRef({ seek: seek.to, speed, volume, muted });

  React.useEffect(() => {
    const host = hostRef.current;
    if (!videoId || !host) return;
    let cancelled = false;
    const mount = document.createElement("div");
    host.appendChild(mount);
    loadApi().then((YT) => {
      if (cancelled) return;
      player.current = new YT.Player(mount, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          start: Math.floor(initial.current.seek),
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            const p = player.current!;
            p.setPlaybackRate(initial.current.speed);
            p.setVolume(initial.current.volume);
            if (initial.current.muted) p.mute();
            setReady(true);
          },
          onStateChange: (e) => {
            if (e.data === ENDED) handlers.current.onEnd();
          },
          onError: () => handlers.current.onError(),
        },
      });
    });
    return () => {
      cancelled = true;
      player.current?.destroy();
      player.current = null;
      setReady(false);
      mount.remove();
    };
  }, [videoId, hostRef]);

  // The position we last asked YouTube for. A video that has not started yet ignores seekTo, so
  // Play asks again, and until YouTube reports a time near it its reads are ignored: they are the
  // old position, and would pull the bar back.
  const pending = React.useRef<{ to: number; since: number } | null>(null);

  React.useEffect(() => {
    const p = player.current;
    if (!ready || !p) return;
    if (playing) {
      p.playVideo();
      if (pending.current) p.seekTo(pending.current.to, true);
    } else p.pauseVideo();
  }, [ready, playing]);

  React.useEffect(() => {
    if (ready) player.current?.setPlaybackRate(speed);
  }, [ready, speed]);

  React.useEffect(() => {
    const p = player.current;
    if (!ready || !p) return;
    p.setVolume(volume);
    if (muted) p.mute();
    else p.unMute();
  }, [ready, volume, muted]);

  const last = React.useRef(seek.to);
  React.useEffect(() => {
    last.current = seek.to;
    pending.current = { to: seek.to, since: Date.now() };
    if (ready) player.current?.seekTo(seek.to, true);
  }, [ready, seek.to, seek.key]);

  // Read YouTube's position while playing.
  React.useEffect(() => {
    if (!ready || !playing) return;
    const id = setInterval(() => {
      const p = player.current;
      if (!p) return;
      const now = p.getCurrentTime();
      if (pending.current) {
        const landed = Math.abs(now - pending.current.to) <= MAX_PLAYED_STEP;
        // YouTube can refuse a jump (past the end of what it can load): after 5 s its time wins.
        if (!landed && Date.now() - pending.current.since < 5000) return;
        pending.current = null;
        if (!landed) last.current = now;
      }
      const step = now - last.current;
      if (step > 0 && step <= MAX_PLAYED_STEP) handlers.current.onAdvance(last.current, now);
      else if (step !== 0) handlers.current.onPosition(now);
      last.current = now;
    }, PLAYBACK_TICK_MS);
    return () => clearInterval(id);
  }, [ready, playing]);

  return { ready };
}
