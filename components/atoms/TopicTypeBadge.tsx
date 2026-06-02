import * as React from "react";
import { Badge } from "./Badge";
import { topicTypeIcon } from "@/lib/icons";
import type { TopicType } from "@/lib/types";

export interface TopicTypeBadgeProps {
  type: TopicType;
  /** Hide the leading type icon. */
  showIcon?: boolean;
  className?: string;
}

export const ALL_TOPIC_TYPES: TopicType[] = [
  "Video",
  "Reading",
  "Quiz",
  "Lab",
  "VILT-Live Session",
  "VILT-Recording",
  "Activity",
  "Project",
  "Practice Assignment",
  "Graded Assignment",
  "Peer-graded",
  "Peer Review",
  "Discussion Prompt",
];

/** Identifies a topic's type. Nested in Topic Header, Topic Row, Course Card. */
export function TopicTypeBadge({ type, showIcon = true, className }: TopicTypeBadgeProps) {
  return (
    <Badge tone="brand" leftIcon={showIcon ? topicTypeIcon(type) : undefined} className={className}>
      {type}
    </Badge>
  );
}
