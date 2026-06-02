"use client";

import * as React from "react";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
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

/** Discussion prompt with a reply textarea + character counter + submit (matches DS). */
export function DiscussionPrompt({
  prompt,
  helper = "Post your answer below. You'll see classmates' responses after you post yours.",
  duration = "10 min",
  maxChars = 500,
  onSubmit,
  className,
}: DiscussionPromptProps) {
  const [text, setText] = React.useState("");

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-lms-border-secondary bg-lms-bg-primary p-5",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <TopicTypeBadge type="Discussion Prompt" />
        <span className="lms-text-xs-regular text-lms-text-tertiary">· {duration}</span>
      </div>

      <h3 className="lms-text-md-semibold text-lms-text-primary">{prompt}</h3>
      <p className="lms-text-sm-regular text-lms-text-secondary">{helper}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxChars))}
        rows={4}
        placeholder="Write your reply…"
        className="lms-text-sm-regular w-full resize-none rounded-lg border border-lms-border-primary bg-lms-bg-secondary px-3 py-2.5 text-lms-text-primary outline-none focus:border-lms-border-brand"
      />

      <div className="flex items-center justify-between">
        <span className="lms-text-xs-regular text-lms-text-tertiary">
          {text.length} / {maxChars} characters
        </span>
        <Button variant="primary" size="md" disabled={!text.trim()} onClick={() => onSubmit?.(text)}>
          Post reply
        </Button>
      </div>
    </div>
  );
}
