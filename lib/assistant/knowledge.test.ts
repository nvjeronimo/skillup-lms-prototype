import { describe, expect, it } from "vitest";
import { KNOWLEDGE, getKnowledge, knowledgeText } from "./knowledge";

const IDS = [
  "completion",
  "completion-by-hand",
  "certificate",
  "program-certificate",
  "saved",
  "notes",
  "lab",
  "duration",
  "navigation",
  "progress",
  "due-dates",
  "quiz-attempts",
  "status-badges",
  "open-response",
  "live-sessions",
  "support",
];

describe("knowledge", () => {
  it("has every entry the script relies on, once", () => {
    expect(KNOWLEDGE.map((k) => k.id).sort()).toEqual([...IDS].sort());
  });
  it("keeps answers short and sourced", () => {
    for (const k of KNOWLEDGE) {
      expect(k.answer.length).toBeGreaterThan(40);
      expect(k.answer.length).toBeLessThan(420);
      expect(k.source).not.toBe("");
    }
  });
  it("throws on an id that does not exist", () => expect(() => getKnowledge("nope")).toThrow());
  it("renders one block for the prompt", () => {
    const text = knowledgeText();
    for (const k of KNOWLEDGE) expect(text).toContain(k.answer);
  });
});
