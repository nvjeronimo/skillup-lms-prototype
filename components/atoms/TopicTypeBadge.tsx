import * as React from "react";
import { Icon, topicTypeIcon } from "@/lib/icons";
import { cn, topicTypeShortLabel } from "@/lib/utils";
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

/**
 * Identifies a topic's type — icon + short label in brand color, no pill
 * background (matches the SKO `LMS / Topic-Types Badge` component).
 */
export function TopicTypeBadge({ type, showIcon = true, className }: TopicTypeBadgeProps) {
  return (
    <span
      className={cn(
        "sk-text-xs-medium inline-flex items-center gap-1 text-sk-text-brand-secondary",
        className,
      )}
    >
      {showIcon ? <Icon icon={topicTypeIcon(type)} size={14} /> : null}
      {topicTypeShortLabel(type)}
    </span>
  );
}
