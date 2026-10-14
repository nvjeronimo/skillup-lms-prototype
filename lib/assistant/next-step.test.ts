import { describe, expect, it } from "vitest";
import { nextStep } from "./next-step";
import { answerScripted } from "./scripted";
import { buildSnapshot } from "./snapshot";

const base = buildSnapshot({ completedTopics: new Set(), bookmarks: new Set() }, { kind: "dashboard" });
const calm = { ...base, due: base.due.map((d) => ({ ...d, when: "Sat" })) };

describe("nextStep", () => {
  it("puts a deadline of today first", () => {
    const urgent = base.due.find((d) => d.when === "Today" || d.when === "Tonight")!;
    expect(nextStep(base)).toEqual({ text: expect.stringContaining(urgent.title), actionId: `due:${urgent.id}` });
  });
  it("then the course in progress", () => {
    const current = calm.courses.find((c) => c.status === "in-progress")!;
    expect(nextStep(calm)).toEqual({
      text: expect.stringContaining(current.title),
      actionId: `resume:${current.slug}`,
    });
  });
  it("then a course not started", () => {
    const fresh = calm.courses.find((c) => c.status === "not-started")!;
    const s = { ...calm, courses: calm.courses.filter((c) => c.status !== "in-progress") };
    expect(nextStep(s)).toEqual({ text: `Start ${fresh.title}.`, actionId: `resume:${fresh.slug}` });
  });
  it("is null when nothing is left", () => {
    expect(nextStep({ ...calm, courses: calm.courses.filter((c) => c.status === "completed") })).toBeNull();
  });
  it("is what the assistant answers to the question", () => {
    expect(answerScripted("What should I do next?", base).text).toBe(nextStep(base)!.text);
    expect(answerScripted("What should I do next?", base).actions.map((a) => a.id)).toEqual([
      nextStep(base)!.actionId,
    ]);
  });
});
