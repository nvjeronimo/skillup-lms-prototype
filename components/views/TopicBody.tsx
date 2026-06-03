"use client";

import * as React from "react";
import { TranscriptTab } from "./TranscriptTab";
import { ReadingView } from "./ReadingView";
import { AssessmentView } from "./AssessmentView";
import { ActivityView } from "./ActivityView";
import { DiscussionView } from "./DiscussionView";
import { ViltView } from "./ViltView";
import { LockedView } from "./LockedView";
import { topicFamily } from "@/lib/content";
import { getTopic } from "@/lib/data";

/** Primary (default-route) content for a topic, chosen by its type. */
export function TopicBody({ topicId, courseSlug }: { topicId: string; courseSlug: string }) {
  const topic = getTopic(topicId);
  if (!topic) return null;
  if (topic.locked) return <LockedView topicId={topicId} />;

  switch (topicFamily(topic.type)) {
    case "video":
      return <TranscriptTab topicId={topicId} courseSlug={courseSlug} />;
    case "reading":
      return <ReadingView topicId={topicId} />;
    case "assessment":
    case "graded":
      return <AssessmentView topicId={topicId} />;
    case "activity":
      return <ActivityView topicId={topicId} />;
    case "discussion":
      return <DiscussionView topicId={topicId} />;
    case "vilt":
      return <ViltView topicId={topicId} />;
    default:
      return <ReadingView topicId={topicId} />;
  }
}
