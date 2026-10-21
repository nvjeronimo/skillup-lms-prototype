import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLmsStore } from "./store";
import { track } from "./analytics";

// The analytics shim reads window (Do-Not-Track); this suite runs in node.
vi.mock("./analytics", () => ({ track: vi.fn() }));

describe("recordQuizResult", () => {
  const topicId = "quiz-under-test";

  beforeEach(() => {
    useLmsStore.setState({ completedTopics: new Set(), quizResults: {}, lastCompleted: null });
  });

  it("plays the completion chain when the quiz completes the topic", () => {
    useLmsStore.getState().recordQuizResult(topicId, 4, 5);
    const { lastCompleted, completedTopics } = useLmsStore.getState();
    expect(completedTopics.has(topicId)).toBe(true);
    expect(lastCompleted?.topicId).toBe(topicId);
  });

  it("does not replay it on a retake of a completed quiz", () => {
    useLmsStore.getState().recordQuizResult(topicId, 3, 5);
    const first = useLmsStore.getState().lastCompleted;
    useLmsStore.setState({ lastCompleted: null });
    useLmsStore.getState().recordQuizResult(topicId, 5, 5);
    const state = useLmsStore.getState();
    expect(first?.topicId).toBe(topicId);
    expect(state.lastCompleted).toBeNull();
    expect(state.quizResults[topicId]).toEqual({ score: 5, total: 5, attempts: 2 });
  });
});

describe("markComplete analytics", () => {
  beforeEach(() => {
    useLmsStore.setState({ completedTopics: new Set(), lastCompleted: null });
    vi.mocked(track).mockClear();
  });

  it("topic_complete carries the topic type (P1-46: topicType=video), topicId kept", () => {
    useLmsStore.getState().markComplete("uxr-m1-t3");
    expect(track).toHaveBeenCalledWith("topic_complete", { topicId: "uxr-m1-t3", topicType: "video" });
  });

  it("a reading reports its own type", () => {
    useLmsStore.getState().markComplete("uxr-m1-t2");
    expect(track).toHaveBeenCalledWith("topic_complete", { topicId: "uxr-m1-t2", topicType: "reading" });
  });
});

/**
 * BR-01 / P1-46: a measured video or podcast completes by itself at 90% played. The video under
 * test is "Discovery interview techniques", 14 min (840 s): 90% is 756 s.
 */
describe("recordPlayback (auto-complete at 90%)", () => {
  const video = "uxr-m1-t3";
  const podcast = "bap-m2-t1"; // 14 min podcast

  beforeEach(() => {
    useLmsStore.setState({ completedTopics: new Set(), lastCompleted: null, toast: null, watched: {} });
  });

  it("keeps the played stretches per topic", () => {
    useLmsStore.getState().recordPlayback(video, 0, 10);
    useLmsStore.getState().recordPlayback(video, 10, 20);
    expect(useLmsStore.getState().watched[video]).toEqual([[0, 20]]);
  });

  it("does not complete below 90%", () => {
    useLmsStore.getState().recordPlayback(video, 0, 755);
    expect(useLmsStore.getState().completedTopics.has(video)).toBe(false);
  });

  it("completes at 90%, with the chain and the toast", () => {
    useLmsStore.getState().recordPlayback(video, 0, 700);
    useLmsStore.getState().recordPlayback(video, 700, 756);
    const s = useLmsStore.getState();
    expect(s.completedTopics.has(video)).toBe(true);
    expect(s.lastCompleted?.topicId).toBe(video);
    expect(s.toast?.message).toBe("Marked as complete · Discovery interview techniques");
  });

  it("never completes again: a rewatch of a completed topic shows no second toast", () => {
    useLmsStore.getState().recordPlayback(video, 0, 800);
    useLmsStore.setState({ toast: null, lastCompleted: null });
    useLmsStore.getState().recordPlayback(video, 0, 840);
    expect(useLmsStore.getState().toast).toBeNull();
    expect(useLmsStore.getState().lastCompleted).toBeNull();
  });

  it("a topic completed by hand before is not completed again either", () => {
    useLmsStore.setState({ completedTopics: new Set([video]), watched: { [video]: [[0, 700]] } });
    useLmsStore.getState().recordPlayback(video, 700, 800);
    expect(useLmsStore.getState().toast).toBeNull();
  });

  it("a seek adds no coverage: time going back or standing still is ignored", () => {
    useLmsStore.getState().recordPlayback(video, 0, 10);
    useLmsStore.getState().recordPlayback(video, 830, 5);
    expect(useLmsStore.getState().watched[video]).toEqual([[0, 10]]);
    expect(useLmsStore.getState().completedTopics.has(video)).toBe(false);
  });

  it("coverage from an earlier session counts (cumulative)", () => {
    useLmsStore.setState({ watched: { [video]: [[0, 400]] } });
    useLmsStore.getState().recordPlayback(video, 400, 760);
    expect(useLmsStore.getState().completedTopics.has(video)).toBe(true);
  });

  it("coverage already past 90% (not completed) completes on the next stretch played", () => {
    useLmsStore.setState({ watched: { [video]: [[0, 800]] } });
    useLmsStore.getState().recordPlayback(video, 100, 101);
    expect(useLmsStore.getState().completedTopics.has(video)).toBe(true);
  });

  it("a podcast completes the same way", () => {
    useLmsStore.getState().recordPlayback(podcast, 0, 760);
    expect(useLmsStore.getState().completedTopics.has(podcast)).toBe(true);
  });

  it("a topic whose playback is not measured never completes by itself (a reading)", () => {
    useLmsStore.getState().recordPlayback("uxr-m1-t2", 0, 100_000);
    expect(useLmsStore.getState().completedTopics.has("uxr-m1-t2")).toBe(false);
  });

  it("setWatched and resetWatched (demo menu) change coverage only", () => {
    useLmsStore.getState().setWatched(video, [[0, 714]]);
    expect(useLmsStore.getState().watched[video]).toEqual([[0, 714]]);
    expect(useLmsStore.getState().completedTopics.has(video)).toBe(false);
    // From 85%, a few seconds of play take it past 90%.
    useLmsStore.getState().recordPlayback(video, 714, 757);
    expect(useLmsStore.getState().completedTopics.has(video)).toBe(true);
    useLmsStore.getState().resetWatched(video);
    expect(useLmsStore.getState().watched[video]).toBeUndefined();
  });
});
