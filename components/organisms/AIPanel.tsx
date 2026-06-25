"use client";

import * as React from "react";
import { Send, Sparkles, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
  { ts: "0:38", text: "Lifecycle starts with customer understanding — before any code" },
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="sk-text-2xs-medium mb-3 text-sk-text-tertiary">{children}</p>;
}

/** Right-side AI assistant panel. Mode = Takeaways · Ask · Chat · Related. */
export function AIPanel({ mode = "Key Takeaways", onModeChange, onClose, className }: AIPanelProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-[360px] flex-col border-l border-sk-border-secondary bg-sk-bg-primary",
        className,
      )}
      aria-label="AI assistant"
    >
      <header className="flex items-center justify-between border-b border-sk-border-secondary px-4 py-4">
        <span className="sk-text-md-semibold inline-flex items-center gap-2 text-sk-text-primary">
          <Icon icon={Sparkles} size={20} className="text-sk-text-brand-secondary" />
          AI Assistant
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI panel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sk-text-tertiary hover:bg-sk-bg-secondary"
        >
          <Icon icon={X} size={18} />
        </button>
      </header>

      <div role="tablist" className="flex items-center gap-4 border-b border-sk-border-secondary px-4">
        {MODES.map((m) => (
          <button
            key={m.value}
            role="tab"
            aria-selected={m.value === mode}
            onClick={() => onModeChange?.(m.value)}
            className={cn(
              "sk-text-sm-semibold -mb-px border-b-2 py-3 transition-colors",
              m.value === mode
                ? "border-sk-border-brand text-sk-text-brand-secondary"
                : "border-transparent text-sk-text-secondary hover:text-sk-text-primary",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="sk-scroll flex-1 overflow-y-auto px-4 py-4">
        {mode === "Key Takeaways" ? (
          <>
            <Eyebrow>Key takeaways · {TAKEAWAYS.length}</Eyebrow>
            <ul className="flex flex-col gap-3">
              {TAKEAWAYS.map((t) => (
                <li
                  key={t.ts}
                  className="rounded-lg border border-sk-border-secondary px-3 py-2.5"
                >
                  <span className="sk-text-xs-semibold block text-sk-text-brand-secondary">{t.ts}</span>
                  <span className="sk-text-sm-regular mt-1 block text-sk-text-primary">{t.text}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {mode === "Ask" ? (
          <>
            <Eyebrow>Ask anything</Eyebrow>
            <input
              placeholder="Ask about this topic…"
              className="sk-text-sm-regular w-full rounded-lg border border-sk-border-primary bg-sk-bg-secondary px-3 py-2.5 text-sk-text-primary outline-none focus:border-sk-border-brand"
            />
            <div className="mt-3 flex flex-col items-start gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="sk-text-sm-medium rounded-full bg-sk-bg-brand-section px-3 py-1.5 text-left text-sk-text-brand-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {mode === "Chat" ? (
          <>
            <Eyebrow>Conversation · 2 messages</Eyebrow>
            <div className="flex flex-col gap-3">
              <div className="rounded-lg bg-sk-bg-brand-section px-3 py-2.5">
                <span className="sk-text-2xs-medium block text-sk-text-brand-secondary">You</span>
                <span className="sk-text-sm-regular mt-1 block text-sk-text-primary">
                  What’s the difference between MVP and prototype?
                </span>
              </div>
              <div className="rounded-lg bg-sk-bg-secondary px-3 py-2.5">
                <span className="sk-text-2xs-medium block text-sk-text-tertiary">AI Assistant</span>
                <span className="sk-text-sm-regular mt-1 block text-sk-text-secondary">
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
            <ul className="flex flex-col gap-2">
              {RELATED.map((r) => (
                <li key={r.title}>
                  <button className="w-full rounded-lg border border-sk-border-secondary px-3 py-2.5 text-left hover:border-sk-border-primary">
                    <span className="sk-text-sm-semibold block text-sk-text-primary">{r.title}</span>
                    <span className="sk-text-xs-regular mt-0.5 block text-sk-text-tertiary">{r.meta}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      {mode === "Ask" || mode === "Chat" ? (
        <div className="flex items-center gap-2 border-t border-sk-border-secondary px-3 py-3">
          <input
            placeholder="Type a message…"
            className="sk-text-sm-regular flex-1 rounded-lg border border-sk-border-primary bg-sk-bg-primary px-3 py-2 text-sk-text-primary outline-none focus:border-sk-border-brand"
          />
          <button
            type="button"
            aria-label="Send"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-sk-bg-brand-solid text-sk-text-primary-on-brand"
          >
            <Icon icon={Send} size={18} />
          </button>
        </div>
      ) : null}
    </aside>
  );
}
