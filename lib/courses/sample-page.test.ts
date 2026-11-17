import { describe, expect, it } from "vitest";
import outline from "@/lib/data-model.json";
import { SIX_SIGMA } from "./sample-page";

/** Topic records the player renders. Module counters in the JSON are not this list. */
function playerTopics() {
  return outline.course.modules.flatMap((mod) => {
    const topics =
      "lessons" in mod && mod.lessons
        ? mod.lessons.flatMap((lesson) => lesson.topics)
        : "topics" in mod && mod.topics
          ? mod.topics
          : [];
    return topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      type: topic.type,
      completed: topic.completed,
      locked: "locked" in topic && Boolean(topic.locked),
    }));
  });
}

function pageTopics() {
  return SIX_SIGMA.modules.flatMap((mod) => (mod.lessons ?? []).flatMap((lesson) => lesson.topics));
}

describe("Six Sigma course page syllabus", () => {
  it("lists every player module, in order", () => {
    expect(SIX_SIGMA.modules.map((mod) => mod.id)).toEqual(
      outline.course.modules.map((mod) => mod.id),
    );
  });

  it("uses the player topic id, title and type for every module", () => {
    const player = playerTopics();
    const page = pageTopics();
    expect(page.map((topic) => topic.id)).toEqual(player.map((topic) => topic.id));
    for (const topic of player) {
      const row = page.find((item) => item.id === topic.id);
      expect(row?.title, topic.id).toBe(topic.title);
      expect(row?.type, topic.id).toBe(topic.type);
      expect(row?.state, topic.id).toBe(
        topic.locked ? "Locked" : topic.completed ? "Done" : "Pending",
      );
    }
  });

  it("prints the same topic total the player sidebar uses", () => {
    const topics = playerTopics();
    const done = topics.filter((topic) => topic.completed && !topic.locked).length;
    const locked = topics.filter((topic) => topic.locked).length;
    const percent = Math.round((done / topics.length) * 100);
    expect(SIX_SIGMA.stats.structure).toBe(
      `${outline.course.modules.length} modules · ${topics.length} topics`,
    );
    expect(SIX_SIGMA.progress.done).toBe(`${done} of ${topics.length} topics`);
    expect(SIX_SIGMA.progress.percent).toBe(percent);
    expect(SIX_SIGMA.progressTab.completion).toMatchObject({
      complete: done,
      incomplete: topics.length - done - locked,
      locked,
    });
    expect(SIX_SIGMA.certificate.status).toBe("not-earned");
    if (SIX_SIGMA.certificate.status !== "not-earned") return;
    expect(SIX_SIGMA.certificate.requirements[1]).toMatchObject({
      detail: `${done} of ${topics.length} topics · ${percent}%`,
      percent,
    });
  });

  it("prints each module's topic count from its own topics", () => {
    outline.course.modules.forEach((mod, index) => {
      const count =
        "lessons" in mod && mod.lessons
          ? mod.lessons.reduce((sum, lesson) => sum + lesson.topics.length, 0)
          : "topics" in mod && mod.topics
            ? mod.topics.length
            : 0;
      expect(SIX_SIGMA.modules[index].topicCount).toBe(
        `${count} ${count === 1 ? "topic" : "topics"}`,
      );
    });
  });
});
