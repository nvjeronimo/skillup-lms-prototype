import { describe, expect, it } from "vitest";
import { buildSystemPrompt, parseModelReply, visibleText } from "./model-reply";
import { buildSnapshot } from "./snapshot";
import { knowledgeText } from "./knowledge";

const actions = [
  { id: "dashboard", label: "Open the Dashboard", href: "/platform/dashboard" },
  { id: "my-learning", label: "Open My Learning", href: "/platform/my-learning" },
];

describe("parseModelReply", () => {
  it("turns the last line into buttons and hides it", () => {
    const a = parseModelReply("Two things are due.\nACTIONS: dashboard, my-learning", actions);
    expect(a).toEqual({ text: "Two things are due.", actions, source: "model" });
  });
  it("drops ids that are not in the snapshot", () => {
    expect(parseModelReply("Here.\nACTIONS: dashboard, /evil, settings", actions).actions).toEqual([actions[0]]);
  });
  it("has no buttons without the line", () => {
    expect(parseModelReply("Just text.", actions)).toEqual({ text: "Just text.", actions: [], source: "model" });
  });
  it("ignores the marker anywhere but the last line", () => {
    const a = parseModelReply("ACTIONS: dashboard\nand then more text.", actions);
    expect(a.actions).toEqual([]);
    expect(a.text).toContain("and then more text.");
  });
  it("caps at three and removes repeats", () => {
    const many = [...actions, { id: "c", label: "C", href: "/c" }, { id: "d", label: "D", href: "/d" }];
    expect(
      parseModelReply("x\nACTIONS: dashboard, dashboard, my-learning, c, d", many).actions.map((a) => a.id),
    ).toEqual(["dashboard", "my-learning", "c"]);
  });
  it("copes with an empty reply", () => expect(parseModelReply("", actions).text).toBe(""));
  it("reads the line when blank lines follow it", () => {
    expect(parseModelReply("Here.\nACTIONS: dashboard\n\n", actions)).toEqual({
      text: "Here.",
      actions: [actions[0]],
      source: "model",
    });
  });
});

describe("visibleText", () => {
  it.each([
    ["Two things.\nACTIONS: dash", "Two things."],
    ["Two things.\nACT", "Two things."],
    ["Two things.\nA", "Two things."],
    ["Two things.\nAnd a third", "Two things.\nAnd a third"],
    ["Two things.", "Two things."],
  ])("%j", (partial, shown) => expect(visibleText(partial)).toBe(shown));
});

describe("buildSystemPrompt", () => {
  it("carries the knowledge, the snapshot and the action ids", () => {
    const snap = buildSnapshot({ completedTopics: new Set(), bookmarks: new Set() }, { kind: "dashboard" });
    const p = buildSystemPrompt(snap);
    expect(p).toContain(knowledgeText());
    expect(p).toContain(snap.courses[0].title);
    for (const a of snap.actions) expect(p).toContain(a.id);
    expect(p).toContain("ACTIONS:");
  });
});
