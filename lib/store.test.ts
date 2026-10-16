import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLmsStore } from "./store";

// The analytics shim reads window (Do-Not-Track); this suite runs in node.
vi.mock("./analytics", () => ({ track: () => {} }));

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
