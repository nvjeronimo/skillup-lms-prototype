import { describe, expect, it } from "vitest";
import { STEPS, stepAction } from "./steps";
import { buildSnapshot } from "@/lib/assistant/snapshot";

const snap = buildSnapshot({ completedTopics: new Set(), bookmarks: new Set() }, { kind: "dashboard" });

describe("steps", () => {
  it("are the five of the spec, in order", () => {
    expect(STEPS.map((s) => s.id)).toEqual(["program", "course", "topic", "complete", "ask"]);
    expect(STEPS.map((s) => s.label)).toEqual([
      "Open your program",
      "Open a course",
      "Start a topic",
      "Complete a topic",
      "Ask the assistant",
    ]);
  });
  it("point at places the snapshot has", () => {
    const current = snap.courses.find((c) => c.status === "in-progress")!;
    expect(stepAction("program", snap)).toMatchObject({ id: expect.stringMatching(/^program:/) });
    expect(stepAction("course", snap)).toMatchObject({ id: `course:${current.slug}` });
    expect(stepAction("topic", snap)).toMatchObject({ id: `resume:${current.slug}` });
    expect(stepAction("complete", snap)).toMatchObject({ id: `resume:${current.slug}` });
    expect(stepAction("ask", snap)).toBe("ask");
  });
  it("have no target when the snapshot has none", () => {
    const bare = { ...snap, actions: [] };
    expect(stepAction("program", bare)).toBeNull();
    expect(stepAction("topic", bare)).toBeNull();
    expect(stepAction("ask", bare)).toBe("ask");
  });
});
