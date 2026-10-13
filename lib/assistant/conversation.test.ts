import { describe, expect, it, vi } from "vitest";
import { STORAGE_KEY, loadMessages, resolveAnswer, saveMessages } from "./conversation";
import { buildSnapshot } from "./snapshot";
import { answerScripted } from "./scripted";

const snapshot = buildSnapshot({ completedTopics: new Set(), bookmarks: new Set() }, { kind: "dashboard" });
const q = "What is due this week?";

describe("resolveAnswer", () => {
  it("uses the script in script mode and never calls the model", async () => {
    const askModel = vi.fn();
    expect(await resolveAnswer({ question: q, snapshot, mode: "script", askModel })).toEqual(
      answerScripted(q, snapshot),
    );
    expect(askModel).not.toHaveBeenCalled();
  });
  it("uses the model's reply in model mode", async () => {
    const a = await resolveAnswer({
      question: q,
      snapshot,
      mode: "model",
      askModel: async () => "Two items.\nACTIONS: dashboard",
    });
    expect(a).toMatchObject({ text: "Two items.", source: "model" });
    expect(a.actions.map((x) => x.id)).toEqual(["dashboard"]);
  });
  it.each([
    [
      "the request fails",
      async () => {
        throw new Error("503");
      },
    ],
    ["the reply is empty", async () => "   "],
  ])("falls back to the script when %s", async (_name, askModel) => {
    expect(await resolveAnswer({ question: q, snapshot, mode: "model", askModel })).toEqual(
      answerScripted(q, snapshot),
    );
  });
});

describe("storage", () => {
  const msg = { id: "1", role: "user" as const, text: "hi" };
  it("round-trips", () => {
    const mem: Record<string, string> = {};
    saveMessages({ setItem: (k, v) => void (mem[k] = v) }, [msg]);
    expect(loadMessages({ getItem: (k) => mem[k] ?? null })).toEqual([msg]);
    expect(Object.keys(mem)).toEqual([STORAGE_KEY]);
  });
  it.each([
    ["missing", undefined],
    [
      "blocked",
      {
        getItem: () => {
          throw new Error("denied");
        },
      },
    ],
    ["empty", { getItem: () => null }],
    ["junk", { getItem: () => "{not json" }],
    ["the wrong shape", { getItem: () => JSON.stringify({ a: 1 }) }],
    ["a bad message", { getItem: () => JSON.stringify([{ id: 1, role: "robot" }]) }],
    ["actions that are not a list", { getItem: () => JSON.stringify([{ id: "a", role: "assistant", text: "x", actions: "abc" }]) }],
    ["an action with no address", { getItem: () => JSON.stringify([{ id: "a", role: "assistant", text: "x", actions: [{ id: "d" }] }]) }],
    ["an unknown source", { getItem: () => JSON.stringify([{ id: "a", role: "assistant", text: "x", source: "oracle" }]) }],
  ])("starts empty when storage is %s", (_name, storage) => expect(loadMessages(storage)).toEqual([]));
  it("does not throw when it cannot save", () => {
    expect(() =>
      saveMessages(
        {
          setItem: () => {
            throw new Error("full");
          },
        },
        [msg],
      ),
    ).not.toThrow();
  });
});
