"use client";

import * as React from "react";
import { Send, Sparkles, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** DS `LMS / AI Panel` Mode (the DS names "Ask" as "Ask AI"; the prototype keeps "Ask", ADR 008). */
export type AIMode = "Key Takeaways" | "Ask" | "Chat" | "Related";

export interface AIPanelProps {
  mode?: AIMode;
  onModeChange?: (mode: AIMode) => void;
  onClose?: () => void;
  className?: string;
}

const MODES: { value: AIMode; label: string }[] = [
  { value: "Key Takeaways", label: "Takeaways" },
  { value: "Ask", label: "Ask" },
  { value: "Chat", label: "Chat" },
  { value: "Related", label: "Related" },
];

const TAKEAWAYS = [
  { ts: "0:38", text: "Lifecycle starts with customer understanding, before any code" },
  { ts: "1:14", text: "AI compresses research phase via synthesis at scale" },
  { ts: "2:14", text: "MVP = test riskiest assumption first" },
];

const SUGGESTIONS = [
  "Summarize this lesson in 3 bullets",
  "Why is MVP testing the riskiest assumption first?",
  "Give me a quiz on this topic",
];

const RELATED = [
  { title: "What AI can do for PMs", meta: "Module 1 · Video · 3m 36s" },
  { title: "Limitations of ChatGPT", meta: "Module 1 · Video · 2m 1s" },
  { title: "Ideation with ChatGPT", meta: "Module 2 · Video · 4m 46s" },
  { title: "User segmentation", meta: "Module 2 · Video · 1m 28s" },
];

/** DS `Section-Title`: body-small/Medium, uppercase. Spacing comes from the column gap. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="sk-text-body-small-medium uppercase text-sko-text-subtle">{children}</p>;
}

/** Right-side AI assistant panel. Mode = Key Takeaways · Ask · Chat · Related (DS `LMS / AI Panel`). */
export function AIPanel({ mode = "Key Takeaways", onModeChange, onClose, className }: AIPanelProps) {
  const askId = React.useId();
  const messageId = React.useId();
  return (
    <aside
      className={cn(
        "flex h-full w-[360px] flex-col border-l border-sko-border-subtle bg-sko-bg-page",
        className,
      )}
      aria-label="AI assistant"
    >
      <header className="flex items-center justify-between border-b border-sko-border-subtle pb-4 pl-5 pr-4 pt-5">
        <span className="sk-text-body-large-medium inline-flex items-center gap-2 text-sko-text-default">
          <Icon icon={Sparkles} size={20} className="text-sko-icon-primary" />
          AI Assistant
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI panel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sko-text-subtle hover:bg-sko-bg-subtle"
        >
          <Icon icon={X} size={18} />
        </button>
      </header>

      {/* DS mode-col: p20, gap 16 — Tabs, Section-Title, then the mode's list (gap 12).
          The tablist sits outside the scroll area so it stays pinned in a long Chat. */}
      <div className="px-5 pt-5">
        <div role="tablist" aria-label="AI assistant mode" className="flex items-center gap-3">
          {MODES.map((m) => {
            const isActive = m.value === mode;
            return (
              <button
                key={m.value}
                role="tab"
                aria-selected={isActive}
                onClick={() => onModeChange?.(m.value)}
                className={cn(
                  "sk-text-body-medium-semibold relative px-1 pb-3 pt-0 transition-colors",
                  isActive
                    ? "text-sko-text-primary"
                    : "text-sko-text-subtle hover:text-sko-text-default",
                )}
              >
                {m.label}
                {/* DS `tab-selected`: 2px brand bar on the tab's bottom edge (32px tab). */}
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-[2px] bg-sko-bg-primary"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sk-scroll flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-4">
        {mode === "Key Takeaways" ? (
          <>
            <Eyebrow>Key takeaways · {TAKEAWAYS.length}</Eyebrow>
            <ul className="flex flex-col gap-3">
              {TAKEAWAYS.map((t) => (
                <li
                  key={t.ts}
                  className="rounded-lg border border-sko-border-subtle bg-sko-bg-subtle px-4 py-3"
                >
                  <span className="sk-text-body-small-medium block text-sko-text-primary">{t.ts}</span>
                  <span className="sk-text-body-medium-medium mt-1.5 block text-sko-text-default">{t.text}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {mode === "Ask" ? (
          <>
            <Eyebrow>Ask anything</Eyebrow>
            <div className="flex flex-col gap-3">
              <label htmlFor={askId} className="sr-only">
                Ask about this topic
              </label>
              <input
                id={askId}
                placeholder="Ask about this topic…"
                className="sk-text-body-medium-medium w-full rounded-lg border border-sko-border-subtle bg-sko-bg-subtle px-4 py-3 text-sko-text-default outline-none placeholder:text-sko-text-placeholder focus:border-sko-border-primary"
              />
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="sk-text-body-small-medium rounded-full bg-sko-bg-primary-soft px-3 py-1.5 text-left text-sko-text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {mode === "Chat" ? (
          <>
            <Eyebrow>Conversation · 2 messages</Eyebrow>
            <div className="flex flex-col gap-3">
              <div className="rounded-lg bg-sko-bg-primary-soft p-3">
                <span className="sk-text-body-small-medium block uppercase text-sko-text-primary">You</span>
                <span className="sk-text-body-medium-medium mt-1 block text-sko-text-default">
                  What’s the difference between MVP and prototype?
                </span>
              </div>
              <div className="rounded-lg border border-sko-border-subtle bg-sko-bg-subtle p-3">
                <span className="sk-text-body-small-medium block uppercase text-sko-text-subtle">AI Assistant</span>
                <span className="sk-text-body-medium-medium mt-1 block text-sko-text-default">
                  An MVP tests assumptions in real conditions; a prototype tests interactions. Use
                  MVP for risk, prototype for design.
                </span>
              </div>
            </div>
          </>
        ) : null}

        {mode === "Related" ? (
          <>
            <Eyebrow>Related units · {RELATED.length}</Eyebrow>
            <ul className="flex flex-col gap-3">
              {RELATED.map((r) => (
                <li key={r.title}>
                  <button className="w-full rounded-lg border border-sko-border-subtle bg-sko-bg-page p-3 text-left hover:border-sko-border-default">
                    <span className="sk-text-body-medium-medium block text-sko-text-default">{r.title}</span>
                    <span className="sk-text-body-small-medium mt-0.5 block text-sko-text-subtle">{r.meta}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      {mode === "Ask" || mode === "Chat" ? (
        <div className="flex items-center gap-2 border-t border-sko-border-subtle px-3 py-3">
          <label htmlFor={messageId} className="sr-only">
            Message
          </label>
          <input
            id={messageId}
            placeholder="Type a message…"
            className="sk-text-body-medium-regular flex-1 rounded-lg border border-sko-border-default bg-sko-bg-page px-3 py-2 text-sko-text-default outline-none focus:border-sko-border-primary"
          />
          <button
            type="button"
            aria-label="Send"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-sko-bg-primary text-sko-text-on-primary"
          >
            <Icon icon={Send} size={18} />
          </button>
        </div>
      ) : null}
    </aside>
  );
}
