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
        "flex flex-col gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5",
        className,
      )}
    >
      <div className="sk-text-xs-medium flex items-center gap-1.5 text-sko-text-muted">
        <Icon icon={MessageCircle} size={14} className="text-sko-text-primary" />
        Discussion
        <span className="sk-text-xs-regular text-sko-text-subtle">· {duration}</span>
      </div>

      <h3 className="sk-text-md-semibold text-sko-text-default">{prompt}</h3>
      <p className="sk-text-sm-regular text-sko-text-muted">{helper}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxChars))}
        rows={4}
        placeholder="Write your reply…"
        className="sk-text-sm-regular w-full resize-none rounded-lg border border-sko-border-default bg-sko-bg-subtle px-3 py-2.5 text-sko-text-default outline-none focus:border-sko-border-primary"
      />

      <div className="flex items-center justify-between">
        <span className="sk-text-xs-regular text-sko-text-subtle">
          {text.length} / {maxChars} characters
        </span>
        <Button variant="primary" size="md" disabled={!text.trim()} onClick={() => onSubmit?.(text)}>
          Post reply
        </Button>
      </div>
    </div>
  );
}
