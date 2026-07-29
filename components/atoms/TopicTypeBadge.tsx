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
  "Lesson Page",
  "Podcast",
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
  "Programming Assignment",
  "Role Play",
  "Dialogue",
];

/**
 * Identifies a topic's type — brand-blue icon + short label in text-secondary,
 * no pill background (matches the SKO `LMS / Topic-Types Badge` component, where
 * the type icon carries the brand colour and the label stays neutral).
 */
export function TopicTypeBadge({ type, showIcon = true, className }: TopicTypeBadgeProps) {
  return (
    <span
      className={cn(
        "sk-text-xs-medium inline-flex items-center gap-1 text-sk-text-secondary",
        className,
      )}
    >
      {showIcon ? (
        <Icon icon={topicTypeIcon(type)} size={14} className="text-sk-text-brand-secondary" />
      ) : null}
      {topicTypeShortLabel(type)}
    </span>
  );
}
