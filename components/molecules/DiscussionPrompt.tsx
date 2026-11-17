import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import styles from "./DiscussionPrompt.module.css";

export interface DiscussionPromptProps {
  prompt: string;
  helper?: string;
  duration?: string;
  maxChars?: number;
  onSubmit?: (text: string) => void;
  className?: string;
}

/**
 * Discussion prompt with a reply textarea + character counter + submit.
 * DS `LMS / Discussion Prompt` (19975:537927): p24, gap 16, the eyebrow row
 * carries only the duration, reply input p12 r8 bg/subtle border/subtle 120px.
 */
export function DiscussionPrompt({
  prompt,
  helper = "Post your answer below. You'll see classmates' responses after you post yours.",
  duration = "10 min",
  maxChars = 500,
  onSubmit,
  className,
}: DiscussionPromptProps) {
  const [text, setText] = React.useState("");

  const replyId = React.useId();
  const countId = React.useId();

  return (
    <div
      className={cn(styles.prompt, className)}
    >
      <span className={`sk-text-body-small-medium ${styles.duration}`}>{duration}</span>

      <h3 className={`sk-text-body-large-semibold ${styles.question}`}>{prompt}</h3>
      <p className={`sk-text-body-medium-regular ${styles.helper}`}>{helper}</p>

      <label htmlFor={replyId} className="sk-sr-only">
        Your reply
      </label>
      <textarea
        id={replyId}
        aria-describedby={countId}
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxChars))}
        rows={4}
        placeholder="Write your reply…"
        className={`sk-text-body-medium-regular ${styles.reply}`}
      />

      <div className={styles.footer}>
        <span id={countId} className={`sk-text-body-small-medium ${styles.count}`}>
          {text.length} / {maxChars} characters
        </span>
        <Button variant="primary" size="sm" disabled={!text.trim()} onClick={() => onSubmit?.(text)}>
          Post reply
        </Button>
      </div>
    </div>
  );
}
