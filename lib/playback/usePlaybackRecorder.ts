"use client";

import * as React from "react";
import { useLmsStore } from "@/lib/store";
import { bufferStretch } from "./buffer";
import type { Interval } from "./coverage";

/**
 * What a video or podcast view does with the time played (BR-01): `advance` on every tick keeps
 * the open stretch in a ref and writes the store only when `bufferStretch` says so (every few
 * seconds, on a seek, at once on reaching 90%); `flush` writes what is pending (pause, end,
 * hidden tab, unmount). Each write also saves the resume position.
 */
export function usePlaybackRecorder(topicId: string, duration: number) {
  const pending = React.useRef<Interval | null>(null);

  const write = React.useCallback(
    (stretches: Interval[]) => {
      const s = useLmsStore.getState();
      for (const [a, b] of stretches) s.recordPlayback(topicId, a, b);
      const last = stretches[stretches.length - 1];
      if (last) s.saveResumePosition(topicId, last[1]);
    },
    [topicId],
  );

  const advance = React.useCallback(
    (from: number, to: number) => {
      const s = useLmsStore.getState();
      const r = bufferStretch(pending.current, from, to, {
        stored: s.watched[topicId] ?? [],
        duration,
        completed: s.completedTopics.has(topicId),
      });
      pending.current = r.pending;
      if (r.flush.length) write(r.flush);
    },
    [topicId, duration, write],
  );

  const flush = React.useCallback(() => {
    const open = pending.current;
    pending.current = null;
    if (open) useLmsStore.getState().recordPlayback(topicId, open[0], open[1]);
  }, [topicId]);

  return { advance, flush };
}
