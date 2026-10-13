import { describe, expect, it } from "vitest";
import { FALLBACK_LEAD, answerScripted, suggestionsFor } from "./scripted";
import { buildSnapshot } from "./snapshot";
import { getKnowledge } from "./knowledge";
import { dashboardDue } from "@/lib/platform/dashboard";
import { DEFAULT_COURSE_SLUG } from "@/lib/data";
import { DEFAULT_TOPIC_ID } from "@/lib/courses/outline";

const state = { completedTopics: new Set<string>(), bookmarks: new Set<string>() };
const dash = buildSnapshot(state, { kind: "dashboard" });
const player = buildSnapshot(state, { kind: "player", courseSlug: DEFAULT_COURSE_SLUG, topicId: DEFAULT_TOPIC_ID });
const program = buildSnapshot(state, { kind: "program", slug: "ai-driven-digital-marketing" });

describe("answerScripted", () => {
  it("lists every due item with its button", () => {
    const a = answerScripted("What is due this week?", dash);
    for (const d of dashboardDue) expect(a.text).toContain(d.title);
    expect(a.actions.map((x) => x.id)).toEqual(dashboardDue.map((d) => `due:${d.id}`));
    expect(a.source).toBe("script");
  });
  it("matches by keyword, whatever the case", () => {
    expect(answerScripted("any DEADLINES coming?", dash).text).toBe(
      answerScripted("What is due this week?", dash).text,
    );
  });
  it("does not match a keyword inside another word", () => {
    expect(answerScripted("is it available?", dash).text).toContain(FALLBACK_LEAD);
  });
  it("resumes the course in progress", () => {
    const a = answerScripted("Where did I stop?", dash);
    const inProgress = dash.courses.find((c) => c.status === "in-progress")!;
    expect(a.text).toContain(inProgress.title);
    expect(a.actions[0].id).toBe(`resume:${inProgress.slug}`);
  });
  it("answers the certificate from the knowledge", () => {
    expect(answerScripted("How do I get my certificate?", dash).text).toContain(getKnowledge("certificate").answer);
  });
  it("summarises only where there is a topic", () => {
    expect(answerScripted("Summarise this topic", player).text).toContain(player.topic!.takeaways[0]);
    expect(answerScripted("Summarise this topic", dash).text).toContain(FALLBACK_LEAD);
  });
  it("lists the first steps that are left, while there are any", () => {
    const fs = { status: "active" as const, done: ["program" as const], baseline: [], greeted: true };
    const active = buildSnapshot(state, { kind: "dashboard" }, fs);
    const a = answerScripted("How do I get started?", active);
    expect(a.text).toContain("4 first steps left");
    expect(a.text).toContain("Open a course");
    expect(a.text).not.toContain("Open your program");
    expect(a.actions).toHaveLength(1);
    expect(answerScripted("How do I get started?", dash).text).toContain(FALLBACK_LEAD);
  });
  it("only ever returns buttons that are in the snapshot", () => {
    const known = new Set(dash.actions.map((a) => a.id));
    for (const q of suggestionsFor(dash))
      for (const a of answerScripted(q, dash).actions) expect(known.has(a.id)).toBe(true);
  });
  it("tries the next intent when the first one does not apply here", () => {
    expect(answerScripted("Summarise my progress", dash).text).toContain("%");
  });
  it.each([
    "",
    "   ",
    "Qual é a capital de Portugal?",
    "asdf qwer",
    "who is the next president",
    "How do I stop email notifications?",
    "Can I change the label colour?",
    "is my laboratory booked?",
  ])("falls back on %j", (q) => {
    const a = answerScripted(q, dash);
    expect(a.text).toContain(FALLBACK_LEAD);
    expect(a.actions).toEqual([]);
  });
});

describe("suggestionsFor", () => {
  it("gives four, each one answered by the script", () => {
    for (const snap of [dash, player, program]) {
      const s = suggestionsFor(snap);
      expect(s).toHaveLength(4);
      for (const q of s) expect(answerScripted(q, snap).text).not.toContain(FALLBACK_LEAD);
    }
  });
  it("is about the topic in the player", () => expect(suggestionsFor(player)[0]).toBe("Summarise this topic"));
});
