import * as React from "react";
import { Icon, topicTypeIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { TopicType } from "@/lib/types";
import styles from "./SavedTopicItem.module.css";

export interface SavedTopicItemProps {
  topicType: TopicType;
  duration: string;
  title: string;
  path: string;
  savedAt: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/** Bookmarked topic row in the Saved panel: type icon + meta + title + path. */
export function SavedTopicItem({
  topicType,
  duration,
  title,
  path,
  savedAt,
  href,
  onClick,
  className,
}: SavedTopicItemProps) {
  const inner = (
    <>
      <span className={styles.iconChip}>
        <Icon icon={topicTypeIcon(topicType)} size={18} />
      </span>
      <span className={styles.body}>
        <span className={styles.meta}>
          <span className={`sk-text-body-small-semibold ${styles.type}`}>{topicType}</span>
          <span className={`sk-text-body-small-regular ${styles.duration}`}>· {duration}</span>
        </span>
        <span className={`sk-text-body-medium-semibold ${styles.title}`}>{title}</span>
        <span className={`sk-text-body-small-regular ${styles.path}`}>{path}</span>
        <span className={`sk-text-body-small-regular ${styles.saved}`}>
          Bookmarked {savedAt}
        </span>
      </span>
    </>
  );

  const classes = cn(styles.item, className);

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  );
}
