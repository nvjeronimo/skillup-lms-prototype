import { describe, expect, it } from "vitest";
import { myLearningCourses } from "./my-learning";
import { PROGRAMS } from "./program";
import { dashboardResume } from "./dashboard";

// Decision 025 (Nelson, 14 Oct 2026): a course of a program is reached through its program page, or from the
// Dashboard's "Pick up where you left off". It never gets a card of its own in My Learning's course list.
const programCourseSlugs = new Set(PROGRAMS.flatMap((p) => p.courses.map((c) => c.slug)));

describe("program courses (decision 025)", () => {
  it("are not listed among My Learning's courses", () => {
    const listed = myLearningCourses.filter((c) => programCourseSlugs.has(c.id)).map((c) => c.title);
    expect(listed).toEqual([]);
  });

  it("can be resumed from the Dashboard", () => {
    expect(dashboardResume.some((c) => programCourseSlugs.has(c.slug))).toBe(true);
  });
});
