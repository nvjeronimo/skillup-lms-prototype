import { describe, expect, it } from "vitest";
import type { Course } from "@/lib/types";
import { courseProgressPct } from "./outline";

const course = {
  overallProgressPct: 37,
  modules: [
    { topics: [{ id: "a" }, { id: "b" }] },
    { lessons: [{ topics: [{ id: "c" }, { id: "d" }] }] },
  ],
} as unknown as Course;

describe("courseProgressPct", () => {
  it("falls back to the seeded percentage without a completed set", () => {
    expect(courseProgressPct(course)).toBe(37);
  });
  it("counts completed topics across flat modules and lessons", () => {
    expect(courseProgressPct(course, new Set(["a", "c", "d"]))).toBe(75);
  });
  it("ignores ids that are not in the course", () => {
    expect(courseProgressPct(course, new Set(["zz"]))).toBe(0);
  });
  it("is 0, not NaN, for a course with no topics", () => {
    const empty = { overallProgressPct: 0, modules: [] } as unknown as Course;
    expect(courseProgressPct(empty, new Set())).toBe(0);
  });
});
