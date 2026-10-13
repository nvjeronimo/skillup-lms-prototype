import { describe, expect, it } from "vitest";
import { STORAGE_KEY, createState, load, reduce, save } from "./progress";

const start = createState(["t1", "t2"]);
const visit = (kind: "program" | "course", slug = "x") => ({ type: "visited" as const, page: { kind, slug } });
const player = { type: "visited" as const, page: { kind: "player" as const, courseSlug: "c", topicId: "t9" } };

describe("reduce", () => {
  it("starts empty, active, with the baseline", () => {
    expect(start).toEqual({ status: "active", done: [], baseline: ["t1", "t2"], greeted: false });
  });
  it("ticks a visit, once, in the order of the steps", () => {
    let s = reduce(start, player);
    s = reduce(s, visit("program"));
    s = reduce(s, player);
    expect(s.done).toEqual(["program", "topic"]);
  });
  it("ignores pages that are no step", () => {
    expect(reduce(start, { type: "visited", page: { kind: "dashboard" } })).toBe(start);
  });
  it("ticks completion only for a topic that is new since the start", () => {
    expect(reduce(start, { type: "completed", completedTopics: ["t1", "t2"] })).toBe(start);
    expect(reduce(start, { type: "completed", completedTopics: ["t1", "t2", "t3"] }).done).toEqual(["complete"]);
  });
  it("is done at five", () => {
    let s = start;
    for (const e of [
      visit("program"),
      visit("course"),
      player,
      { type: "completed" as const, completedTopics: ["t3"] },
      { type: "asked" as const },
    ])
      s = reduce(s, e);
    expect(s).toMatchObject({ status: "done", done: ["program", "course", "topic", "complete", "ask"] });
    expect(reduce(s, visit("program"))).toBe(s);
  });
  it("stays dismissed", () => {
    const d = reduce(start, { type: "dismissed" });
    expect(d.status).toBe("dismissed");
    expect(reduce(d, { type: "asked" })).toBe(d);
  });
  it("remembers the greeting in any status", () => {
    expect(reduce(start, { type: "greeted" }).greeted).toBe(true);
    expect(reduce(reduce(start, { type: "dismissed" }), { type: "greeted" }).greeted).toBe(true);
  });
  it("returns the same state for a second greeting", () => {
    const g = reduce(start, { type: "greeted" });
    expect(reduce(g, { type: "greeted" })).toBe(g);
  });
  it("restarts from today's completions", () => {
    const d = reduce(reduce(start, { type: "dismissed" }), { type: "greeted" });
    expect(reduce(d, { type: "restarted", completedTopics: ["t1", "t2", "t3"] })).toEqual(
      createState(["t1", "t2", "t3"]),
    );
  });
});

describe("storage", () => {
  it("round-trips", () => {
    const mem: Record<string, string> = {};
    const s = reduce(start, visit("program"));
    save({ setItem: (k, v) => void (mem[k] = v) }, s);
    expect(Object.keys(mem)).toEqual([STORAGE_KEY]);
    expect(load({ getItem: (k) => mem[k] ?? null }, ["zzz"])).toEqual(s);
  });
  it.each([
    ["missing", undefined],
    ["empty", { getItem: () => null }],
    [
      "blocked",
      {
        getItem: () => {
          throw new Error("denied");
        },
      },
    ],
    ["junk", { getItem: () => "{nope" }],
    ["another shape", { getItem: () => JSON.stringify({ status: "active" }) }],
    [
      "an unknown status",
      { getItem: () => JSON.stringify({ status: "paused", done: [], baseline: [], greeted: false }) },
    ],
    [
      "an unknown step",
      { getItem: () => JSON.stringify({ status: "active", done: ["dance"], baseline: [], greeted: false }) },
    ],
  ])("starts fresh from today's completions when storage is %s", (_n, storage) => {
    expect(load(storage, ["t1"])).toEqual(createState(["t1"]));
  });
  it("does not throw when it cannot save", () => {
    expect(() =>
      save(
        {
          setItem: () => {
            throw new Error("full");
          },
        },
        start,
      ),
    ).not.toThrow();
  });
});
