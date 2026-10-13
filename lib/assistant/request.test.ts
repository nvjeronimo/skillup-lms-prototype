import { describe, expect, it } from "vitest";
import { MAX_SNAPSHOT_BYTES, parseRequest } from "./request";
import { buildSnapshot } from "./snapshot";

const snapshot = JSON.parse(
  JSON.stringify(buildSnapshot({ completedTopics: new Set(), bookmarks: new Set() }, { kind: "dashboard" })),
);
const ask = (text: string) => ({ role: "user", text });

describe("parseRequest", () => {
  it("accepts a question with a real snapshot", () => {
    const r = parseRequest({ messages: [ask("What is due?")], snapshot });
    expect(r.ok && r.turns).toEqual([{ role: "user", text: "What is due?" }]);
  });
  it("keeps the real snapshot under the size limit", () => {
    expect(JSON.stringify(snapshot).length).toBeLessThan(MAX_SNAPSHOT_BYTES);
  });
  it("keeps the last ten turns and starts on the learner", () => {
    const messages = Array.from({ length: 13 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", text: `m${i}` }));
    const r = parseRequest({ messages, snapshot });
    expect(r.ok && r.turns.length).toBe(9);
    expect(r.ok && r.turns[0]).toEqual({ role: "user", text: "m4" });
  });
  it.each([
    ["no body", null],
    ["no messages", { snapshot }],
    ["a bad role", { messages: [{ role: "system", text: "x" }], snapshot }],
    ["an empty question", { messages: [ask("   ")], snapshot }],
    ["an answer last", { messages: [ask("a"), { role: "assistant", text: "b" }], snapshot }],
    ["a question over 500 characters", { messages: [ask("x".repeat(501))], snapshot }],
    ["an earlier turn over its limit", { messages: [ask("x".repeat(501)), { role: "assistant", text: "b" }, ask("hi")], snapshot }],
    ["an earlier answer over its limit", { messages: [ask("a"), { role: "assistant", text: "x".repeat(4001) }, ask("hi")], snapshot }],
    ["no snapshot", { messages: [ask("hi")] }],
    ["a snapshot that is not one", { messages: [ask("hi")], snapshot: { actions: [], courses: [], programs: [], due: [] } }],
    ["an oversized snapshot", { messages: [ask("hi")], snapshot: { ...snapshot, learner: { firstName: "x".repeat(MAX_SNAPSHOT_BYTES), role: "" } } }],
    ["an action that is not an action", { messages: [ask("hi")], snapshot: { ...snapshot, actions: [{ id: 1 }] } }],
  ])("rejects %s", (_name, body) => expect(parseRequest(body).ok).toBe(false));
});
