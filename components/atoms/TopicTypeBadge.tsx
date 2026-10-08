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
 * Identifies a topic's type (DS `LMS / Topic-Types Badge`, 19975:536800): Badge v2
 * Style=Plain, Size=sm, Color=Brand with the label overridden to text/subtle. The 12px icon
 * (icon/primary) sits in a 20×20 container (its bg/primary-soft fill is hidden in the DS),
 * 6px before the label (body-small/Medium). 20px high with the icon, 18px without.
 */
export function TopicTypeBadge({ type, showIcon = true, className }: TopicTypeBadgeProps) {
  return (
    <span
      className={cn(
        "sk-text-body-small-medium inline-flex items-center gap-1.5 text-sko-text-subtle",
        className,
      )}
    >
      {showIcon ? (
        <span className="inline-flex size-5 shrink-0 items-center justify-center">
          <Icon icon={topicTypeIcon(type)} size={12} className="text-sko-icon-primary" />
        </span>
      ) : null}
      {topicTypeShortLabel(type)}
    </span>
  );
}
