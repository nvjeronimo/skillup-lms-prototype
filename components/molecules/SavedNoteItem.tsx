import * as React from "react";
import { cn } from "@/lib/utils";

export interface SavedNoteItemProps {
  ts: string;
  topicTitle: string;
  anchorQuote: string;
  text: string;
  tags: string[];
  savedAt: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/** Saved note in the Saved panel: ts·topic + anchor quote + note text + tags. */
export function SavedNoteItem({
  ts,
  topicTitle,
  anchorQuote,
  text,
  tags,
  savedAt,
  href,
  onClick,
  className,
}: SavedNoteItemProps) {
  const inner = (
    <>
      <span className="flex items-baseline justify-between gap-2">
        <span className="sk-text-xs-semibold min-w-0 truncate text-sk-text-brand-secondary">
          {ts} · {topicTitle}
        </span>
        <span className="sk-text-xs-regular shrink-0 text-sk-text-tertiary">{savedAt}</span>
      </span>
      <span className="sk-text-sm-italic mt-2 block border-l-[3px] border-sk-border-brand pl-3 text-sk-text-tertiary">
        {anchorQuote}
      </span>
      <span className="sk-text-sm-medium mt-2 block text-sk-text-primary">{text}</span>
      {tags.length ? (
        <span className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="sk-text-xs-medium rounded bg-sk-bg-secondary px-2 py-0.5 text-sk-text-tertiary"
            >
              #{t}
            </span>
          ))}
        </span>
      ) : null}
    </>
  );

  const classes = cn(
    "block w-full px-4 py-4 text-left transition-colors hover:bg-sk-bg-secondary",
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
