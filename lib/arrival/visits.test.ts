import { describe, expect, it } from "vitest";
import { arrivalKey, courseArrivalPath, decideVisit, topicArrivalPath, isFirstVisit, markVisited, parseVisited, serializeVisited } from "./visits";

describe("arrivalKey", () => {
  it("is the pathname without query or hash", () => {
    expect(arrivalKey("/platform/dashboard?demo=1#x")).toBe("/platform/dashboard");
  });
  it("decodes an encoded slug (and keeps a malformed one as it is)", () => {
    expect(arrivalKey("/platform/course/caf%C3%A9")).toBe("/platform/course/café");
    expect(arrivalKey("/platform/course/caf%E9%")).toBe("/platform/course/caf%E9%");
  });
  it("drops a trailing slash but keeps the root", () => {
    expect(arrivalKey("/platform/dashboard/")).toBe("/platform/dashboard");
    expect(arrivalKey("/")).toBe("/");
    expect(arrivalKey("")).toBe("/");
  });
});

describe("parseVisited", () => {
  it("reads a JSON list of paths", () => {
    expect([...parseVisited('["/a","/b"]')]).toEqual(["/a", "/b"]);
  });
  it("is empty for nothing, junk or a non-list", () => {
    expect(parseVisited(null).size).toBe(0);
    expect(parseVisited("{oops").size).toBe(0);
    expect(parseVisited('{"a":1}').size).toBe(0);
  });
  it("ignores entries that are not strings", () => {
    expect([...parseVisited('["/a",3,null]')]).toEqual(["/a"]);
  });
});

describe("isFirstVisit / markVisited", () => {
  it("is a first visit until the path is marked", () => {
    const visited = new Set<string>();
    expect(isFirstVisit("/platform/dashboard", visited)).toBe(true);
    const next = markVisited("/platform/dashboard?demo=1", visited);
    expect(isFirstVisit("/platform/dashboard", next)).toBe(false);
  });
  it("keys on the path, not the query", () => {
    const visited = new Set(["/platform/my-learning"]);
    expect(isFirstVisit("/platform/my-learning?status=done", visited)).toBe(false);
  });
  it("does not mutate the set it is given", () => {
    const visited = new Set<string>();
    markVisited("/a", visited);
    expect(visited.size).toBe(0);
  });
  it("round-trips through storage text", () => {
    const text = serializeVisited(markVisited("/b", new Set(["/a"])));
    expect([...parseVisited(text)]).toEqual(["/a", "/b"]);
  });
});

describe("topicArrivalPath", () => {
  it("is the topic for the topic and its tabs, null elsewhere", () => {
    expect(topicArrivalPath("/course/a/topic/t1")).toBe("/course/a/topic/t1");
    expect(topicArrivalPath("/course/a/topic/t1/downloads")).toBe("/course/a/topic/t1");
    expect(topicArrivalPath("/course/a/certificate")).toBeNull();
    expect(topicArrivalPath("/platform/dashboard")).toBeNull();
  });
});

describe("course arrival", () => {
  it("marks the course once across several topics", () => {
    const course = courseArrivalPath("six-sigma");
    expect(course).toBe("/course/six-sigma");
    let visited = new Set<string>();
    const firsts: [boolean, boolean][] = [];
    for (const topic of ["m3-t1", "m3-t2", "m3-t3", "m3-t1"]) {
      const body = decideVisit(`/course/six-sigma/topic/${topic}`, visited);
      const shell = decideVisit(course, body.visited);
      visited = shell.visited;
      firsts.push([body.first, shell.first]);
    }
    expect(firsts).toEqual([
      [true, true],
      [true, false],
      [true, false],
      [false, false],
    ]);
  });
  it("leaves the set alone on a revisit", () => {
    const v = new Set(["/course/a"]);
    expect(decideVisit("/course/a", v).visited).toBe(v);
  });
});
