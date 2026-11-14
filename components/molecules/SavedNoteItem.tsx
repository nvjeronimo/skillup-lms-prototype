import * as React from "react";
import { cn } from "@/lib/utils";
import { TranscriptLine } from "./TranscriptLine";
import styles from "./SavedNoteItem.module.css";

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
      <span className={styles.head}>
        <span className={`sk-text-body-small-semibold ${styles.where}`}>
          {ts} · {topicTitle}
        </span>
        <span className={`sk-text-body-small-regular ${styles.saved}`}>{savedAt}</span>
      </span>
      {/* The anchor is the transcript line, read-only, as in the DS Note-Item v1.1 (14 Oct 2026). */}
      <TranscriptLine ts="" text={anchorQuote} active readOnly className={styles.anchor} />
      <span className={`sk-text-body-medium-medium ${styles.text}`}>{text}</span>
      {tags.length ? (
        <span className={styles.tags}>
          {tags.map((t) => (
            <span
              key={t}
              className={`sk-text-body-small-medium ${styles.tag}`}
            >
              #{t}
            </span>
          ))}
        </span>
      ) : null}
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
