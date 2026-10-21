import { describe, expect, it } from "vitest";
import { completesByHand, isPlaybackMeasured } from "@/lib/content";
import type { FlatTopic } from "@/lib/types";

const topic = (over: Partial<FlatTopic>): FlatTopic => ({
  id: "t",
  type: "Video",
  title: "T",
  duration: "10 min",
  completed: false,
  moduleId: "m",
  moduleLabel: "Module 1",
  moduleTitle: "M",
  index: 0,
  ...over,
});

describe("isPlaybackMeasured", () => {
  it("a video or podcast with a duration is measured by default", () => {
    expect(isPlaybackMeasured(topic({ type: "Video" }))).toBe(true);
    expect(isPlaybackMeasured(topic({ type: "Podcast" }))).toBe(true);
  });
  it("not when the topic says its playback cannot be measured", () =>
    expect(isPlaybackMeasured(topic({ playbackMeasurable: false }))).toBe(false));
  // No "without a duration" case: getMediaSeconds falls back to 200 s for a missing duration.
  it("never for other types", () => expect(isPlaybackMeasured(topic({ type: "Reading" }))).toBe(false));
});

describe("completesByHand", () => {
  it("a measured video or podcast completes by itself, not by hand (Nelson, 21 Oct 2026)", () => {
    expect(completesByHand(topic({ type: "Video" }))).toBe(false);
    expect(completesByHand(topic({ type: "Podcast" }))).toBe(false);
  });
  it("one whose playback cannot be measured completes by hand, as a Reading (BR-01)", () => {
    expect(completesByHand(topic({ type: "Video", playbackMeasurable: false }))).toBe(true);
    expect(completesByHand(topic({ type: "Podcast", playbackMeasurable: false }))).toBe(true);
  });
  it("a reading still completes by hand", () => expect(completesByHand(topic({ type: "Reading" }))).toBe(true));
});
