import { outline as marketing } from "@/lib/courses/digital-marketing-fundamentals-and-the-ai-mindset/outline";
import { flattenOutline } from "@/lib/courses/outline";
import { getActivity, topicFamily } from "@/lib/content";
import { getCourseBySlug, getTopic } from "@/lib/data";
import { describe, expect, it } from "vitest";
import { playerChrome } from "./playerChrome";

const SLUG = "single-video-topic";
const TOPIC_ID = "svt-m1-t1";

describe("Single video topic", () => {
  it("renders without the sidebar and with the progress ring and the footer", () => {
    const course = getCourseBySlug(SLUG);
    const topic = getTopic(TOPIC_ID, course);
    expect(topic).toBeDefined();
    expect(course.modules).toHaveLength(1);
    expect(flattenOutline(course)).toHaveLength(1);
    expect(topic?.type).toBe("Video");
    expect(topic?.youtube).toBeUndefined();
    expect(topic?.videoSrc).toBeUndefined();
    // Same lesson as Digital Marketing Fundamentals "Course Introduction" (dmf-m1-t1). Neither
    // topic sets a source of its own, so the player uses the one shared file (sampleVideo).
    const source = flattenOutline(marketing).find((t) => t.id === "dmf-m1-t1");
    expect(source?.type).toBe("Video");
    expect(topic?.duration).toBe(source?.duration);
    expect(topic?.transcript?.map((line) => line.text)).toEqual(source?.transcript?.map((line) => line.text));
    expect(topicFamily(topic!.type)).not.toBe("activity");
    expect(getActivity(topic!).packageUrl).toBeUndefined();

    // What PlayerShell draws from this decision.
    expect(playerChrome(course, topic!)).toEqual({
      showSidebar: false,
      showProgressRing: true,
      showFooter: true,
      barePackage: false,
    });
  });
});
