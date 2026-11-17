import { flattenOutline } from "@/lib/courses/outline";
import { getActivity, topicFamily } from "@/lib/content";
import type { Course, FlatTopic } from "@/lib/types";

/**
 * What the immersive player draws around a topic (PlayerShell).
 * One module and one topic: no sidebar and no Course Journey.
 * That topic is a SCORM activity: also no progress ring and no footer.
 * Any other single topic keeps the ring and the footer.
 */
export interface PlayerChrome {
  showSidebar: boolean;
  showProgressRing: boolean;
  showFooter: boolean;
  /** One SCORM package fills the content area. */
  barePackage: boolean;
}

export function playerChrome(course: Course, topic: FlatTopic): PlayerChrome {
  const topics = flattenOutline(course);
  const singleTopic = course.modules.length === 1 && topics.length === 1;
  const scorm = topicFamily(topic.type) === "activity" && getActivity(topic).kind === "scorm";
  const barePackage = singleTopic && scorm;
  return {
    showSidebar: !singleTopic,
    showProgressRing: !barePackage,
    showFooter: !barePackage,
    barePackage,
  };
}
