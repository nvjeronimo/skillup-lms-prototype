import { describe, expect, it } from "vitest";
import { isAssistantPath, pageContextFromPath } from "./page-context";

describe("pageContextFromPath", () => {
  it.each([
    ["/platform/dashboard", { kind: "dashboard" }],
    ["/platform/my-learning", { kind: "my-learning" }],
    ["/platform/program/ai-driven-digital-marketing", { kind: "program", slug: "ai-driven-digital-marketing" }],
    ["/platform/course/ux-research-and-design-thinking", { kind: "course", slug: "ux-research-and-design-thinking" }],
    ["/course/six-sigma/topic/m3-t1", { kind: "player", courseSlug: "six-sigma", topicId: "m3-t1" }],
    ["/course/six-sigma/topic/m3-t1/notes", { kind: "player", courseSlug: "six-sigma", topicId: "m3-t1" }],
    ["/platform/certificate/six-sigma", { kind: "platform" }],
    ["/platform", { kind: "platform" }],
  ])("%s", (path, expected) => expect(pageContextFromPath(path)).toEqual(expected));
});

describe("isAssistantPath", () => {
  it("is on for platform and player addresses", () => {
    expect(isAssistantPath("/platform/dashboard")).toBe(true);
    expect(isAssistantPath("/course/six-sigma/topic/m3-t1")).toBe(true);
  });
  it("is off elsewhere", () => {
    expect(isAssistantPath("/lab")).toBe(false);
    expect(isAssistantPath("/partner/ibm")).toBe(false);
    expect(isAssistantPath("/")).toBe(false);
  });
});
