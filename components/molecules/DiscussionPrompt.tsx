"use client";

import * as React from "react";
import { Icon, MessageCircle } from "@/lib/icons";
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
        "flex flex-col gap-3 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5",
        className,
      )}
    >
      <div className="sk-text-xs-medium flex items-center gap-1.5 text-sk-text-secondary">
        <Icon icon={MessageCircle} size={14} className="text-sk-text-brand-secondary" />
        Discussion
        <span className="sk-text-xs-regular text-sk-text-tertiary">· {duration}</span>
      </div>

      <h3 className="sk-text-md-semibold text-sk-text-primary">{prompt}</h3>
      <p className="sk-text-sm-regular text-sk-text-secondary">{helper}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxChars))}
        rows={4}
        placeholder="Write your reply…"
        className="sk-text-sm-regular w-full resize-none rounded-lg border border-sk-border-primary bg-sk-bg-secondary px-3 py-2.5 text-sk-text-primary outline-none focus:border-sk-border-brand"
      />

      <div className="flex items-center justify-between">
        <span className="sk-text-xs-regular text-sk-text-tertiary">
          {text.length} / {maxChars} characters
        </span>
        <Button variant="primary" size="md" disabled={!text.trim()} onClick={() => onSubmit?.(text)}>
          Post reply
        </Button>
      </div>
    </div>
  );
}
