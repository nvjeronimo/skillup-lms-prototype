import * as React from "react";
import { Icon, topicTypeIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { TopicType } from "@/lib/types";

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
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lms-bg-brand-section text-lms-text-brand-secondary">
        <Icon icon={topicTypeIcon(topicType)} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="lms-text-xs-semibold text-lms-text-brand-secondary">{topicType}</span>
          <span className="lms-text-xs-regular text-lms-text-tertiary">· {duration}</span>
        </span>
        <span className="lms-text-sm-semibold mt-0.5 block text-lms-text-primary">{title}</span>
        <span className="lms-text-xs-regular mt-0.5 block text-lms-text-tertiary">{path}</span>
        <span className="lms-text-xs-regular mt-1 block text-lms-text-tertiary">
          Saved {savedAt}
        </span>
      </span>
    </>
  );

  const classes = cn(
    "flex w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-lms-bg-secondary",
    className,
  );

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
