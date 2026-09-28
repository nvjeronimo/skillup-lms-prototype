"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-6",
        className,
      )}
    >
      <span className="sk-text-xs-medium text-sko-text-subtle">{duration}</span>

      <h3 className="sk-text-md-semibold text-sko-text-default">{prompt}</h3>
      <p className="sk-text-sm-regular text-sko-text-muted">{helper}</p>

      <label htmlFor={replyId} className="sr-only">
        Your reply
      </label>
      <textarea
        id={replyId}
        aria-describedby={countId}
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxChars))}
        rows={4}
        placeholder="Write your reply…"
        className="sk-text-sm-regular min-h-[120px] w-full resize-none rounded-lg border border-sko-border-default bg-sko-bg-subtle p-3 text-sko-text-default outline-none placeholder:text-sko-text-subtle focus:border-sko-border-primary"
      />

      <div className="flex items-center justify-between">
        <span id={countId} className="sk-text-xs-medium text-sko-text-subtle">
          {text.length} / {maxChars} characters
        </span>
        <Button variant="primary" size="sm" disabled={!text.trim()} onClick={() => onSubmit?.(text)}>
          Post reply
        </Button>
      </div>
    </div>
  );
}
