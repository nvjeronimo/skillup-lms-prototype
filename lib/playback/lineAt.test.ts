import { describe, expect, it } from "vitest";
import { lineAt } from "./lineAt";

const lines = [
  { id: "a", ts: "0:00" },
  { id: "b", ts: "0:17" },
  { id: "c", ts: "1:05" },
];

describe("lineAt", () => {
  it("is the last line that has started", () => expect(lineAt(lines, 30)).toBe("b"));
  it("a line starts on its own second", () => expect(lineAt(lines, 65)).toBe("c"));
  it("is the first line at the very start", () => expect(lineAt(lines, 0)).toBe("a"));
  it("is undefined without a transcript", () => expect(lineAt([], 10)).toBeUndefined());
});
