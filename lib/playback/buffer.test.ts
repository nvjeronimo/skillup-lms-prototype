import { describe, expect, it } from "vitest";
import { RESUME_SAVE_EVERY_SECONDS, type Interval } from "./coverage";
import { bufferStretch } from "./buffer";

const d = 100;
const none: Interval[] = [];

describe("bufferStretch", () => {
  it("extends the open stretch while playback is continuous, without flushing", () => {
    const a = bufferStretch(null, 0, 0.25, { stored: none, duration: d, completed: false });
    const b = bufferStretch(a.pending, 0.25, 0.5, { stored: none, duration: d, completed: false });
    expect(b).toEqual({ pending: [0, 0.5], flush: [] });
  });

  it("flushes the stretch once it is RESUME_SAVE_EVERY_SECONDS long", () => {
    const r = bufferStretch([0, RESUME_SAVE_EVERY_SECONDS - 0.25], RESUME_SAVE_EVERY_SECONDS - 0.25, RESUME_SAVE_EVERY_SECONDS, {
      stored: none,
      duration: d,
      completed: false,
    });
    expect(r).toEqual({ pending: null, flush: [[0, RESUME_SAVE_EVERY_SECONDS]] });
  });

  it("flushes at once when stored + buffered coverage reaches 90%, so completion is not delayed", () => {
    const r = bufferStretch([88, 89.75], 89.75, 90, { stored: [[0, 88]], duration: d, completed: false });
    expect(r.flush).toEqual([[88, 90]]);
    expect(r.pending).toBeNull();
  });

  it("does not flush on the threshold for a topic already completed", () => {
    const r = bufferStretch([88, 89.75], 89.75, 90, { stored: [[0, 88]], duration: d, completed: true });
    expect(r.flush).toEqual([]);
  });

  it("a seek between ticks closes the open stretch: the jump is never counted", () => {
    const r = bufferStretch([0, 2], 50, 50.25, { stored: none, duration: d, completed: false });
    expect(r).toEqual({ pending: [50, 50.25], flush: [[0, 2]] });
  });
});
