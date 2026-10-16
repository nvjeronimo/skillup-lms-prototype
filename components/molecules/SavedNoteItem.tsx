import * as React from "react";
import { cn } from "@/lib/utils";
import { TranscriptLine } from "./TranscriptLine";

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

/** Saved note in the Saved panel: ts·topic + anchor line (Transcript-Line) + note text + tags. */
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
        <span className="sk-text-body-small-semibold min-w-0 truncate text-sko-text-primary">
          {ts} · {topicTitle}
        </span>
        <span className="sk-text-body-small-regular shrink-0 text-sko-text-subtle">{savedAt}</span>
      </span>
      {/* The anchor is the transcript line, read-only, as in the DS Note-Item v1.1 (14 Oct 2026). */}
      <TranscriptLine ts="" text={anchorQuote} active readOnly className="mt-2" />
      <span className="sk-text-body-medium-medium mt-2 block text-sko-text-default">{text}</span>
      {tags.length ? (
        <span className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="sk-text-body-small-medium rounded-full bg-sko-bg-subtle px-2 py-0.5 text-sko-text-subtle"
            >
              #{t}
            </span>
          ))}
        </span>
      ) : null}
    </>
  );

  const classes = cn(
    "block w-full px-4 py-4 text-left transition-colors hover:bg-sko-bg-subtle",
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
