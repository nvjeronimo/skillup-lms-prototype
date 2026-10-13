import { describe, expect, it } from "vitest";
import { buildSnapshot } from "./snapshot";
import { dashboardDue } from "@/lib/platform/dashboard";
import { myLearningCourses, myLearningPrograms } from "@/lib/platform/my-learning";
import { DEFAULT_COURSE_SLUG } from "@/lib/data";
import { DEFAULT_TOPIC_ID } from "@/lib/courses/outline";

const empty = { completedTopics: new Set<string>(), bookmarks: new Set<string>() };

describe("buildSnapshot", () => {
  it("lists what My Learning and the Dashboard list", () => {
    const s = buildSnapshot(empty, { kind: "dashboard" });
    expect(s.courses).toHaveLength(myLearningCourses.length);
    expect(s.programs).toHaveLength(myLearningPrograms.length);
    expect(s.due.map((d) => d.id)).toEqual(dashboardDue.map((d) => d.id));
    expect(s.topic).toBeUndefined();
  });
  it("derives status from progress", () => {
    const s = buildSnapshot(empty, { kind: "my-learning" });
    for (const c of myLearningCourses) {
      const got = s.courses.find((x) => x.slug === c.id)!;
      expect(got.status).toBe(
        c.progressPct === null ? "not-started" : c.progressPct === 100 ? "completed" : "in-progress",
      );
    }
  });
  it("gives every action a unique id and an internal address", () => {
    const { actions } = buildSnapshot(empty, { kind: "dashboard" });
    expect(new Set(actions.map((a) => a.id)).size).toBe(actions.length);
    for (const a of actions) expect(a.href.startsWith("/")).toBe(true);
    expect(actions.map((a) => a.id)).toEqual(
      expect.arrayContaining(["dashboard", "my-learning", `due:${dashboardDue[0].id}`]),
    );
  });
  it("adds the topic in the player, with its completion", () => {
    const page = { kind: "player" as const, courseSlug: DEFAULT_COURSE_SLUG, topicId: DEFAULT_TOPIC_ID };
    expect(buildSnapshot(empty, page).topic).toMatchObject({ id: DEFAULT_TOPIC_ID, completed: false });
    expect(buildSnapshot({ ...empty, completedTopics: new Set([DEFAULT_TOPIC_ID]) }, page).topic?.completed).toBe(
      true,
    );
  });
  it("leaves the topic out for an address it does not know", () => {
    expect(buildSnapshot(empty, { kind: "player", courseSlug: "no-such-course", topicId: "x" }).topic).toBeUndefined();
    expect(
      buildSnapshot(empty, { kind: "player", courseSlug: DEFAULT_COURSE_SLUG, topicId: "no-such-topic" }).topic,
    ).toBeUndefined();
    expect(() => buildSnapshot(empty, { kind: "course", slug: "no-such-course" })).not.toThrow();
  });
});
