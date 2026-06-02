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

const MODES: AIMode[] = ["Key Takeaways", "Ask", "Chat", "Related"];

const TAKEAWAYS = [
  "The product lifecycle starts with deep customer understanding, before any code.",
  "AI compresses the research phase — synthesis at scale, not replacement.",
  "An MVP is the smallest experiment to test the riskiest assumption.",
];

const RELATED = [
  "The define phase",
  "DMAIC vs DMADV",
  "Lean principles overview",
];

/** Right-side AI assistant panel. Mode = Key Takeaways · Ask · Chat · Related. */
export function AIPanel({ mode = "Key Takeaways", onModeChange, onClose, className }: AIPanelProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-[360px] flex-col border-l border-lms-border-secondary bg-lms-bg-primary",
        className,
      )}
      aria-label="AI assistant"
    >
      <header className="flex items-center justify-between border-b border-lms-border-secondary px-4 py-4">
        <span className="lms-text-md-semibold inline-flex items-center gap-2 text-lms-text-primary">
          <Icon icon={Sparkles} size={20} className="text-lms-text-brand-secondary" />
          AI assistant
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI panel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-lms-text-tertiary hover:bg-lms-bg-secondary"
        >
          <Icon icon={X} size={18} />
        </button>
      </header>

      <div role="tablist" className="flex gap-1 border-b border-lms-border-secondary px-3 py-2">
        {MODES.map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={m === mode}
            onClick={() => onModeChange?.(m)}
            className={cn(
              "lms-text-xs-semibold rounded-full px-2.5 py-1 transition-colors",
              m === mode
                ? "bg-lms-bg-brand-section text-lms-text-brand-secondary"
                : "text-lms-text-secondary hover:bg-lms-bg-secondary",
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="lms-scroll flex-1 overflow-y-auto px-4 py-4">
        {mode === "Key Takeaways" ? (
          <ul className="flex flex-col gap-3">
            {TAKEAWAYS.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="lms-text-xs-semibold mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lms-bg-brand-section text-lms-text-brand-secondary">
                  {i + 1}
                </span>
                <span className="lms-text-sm-regular text-lms-text-secondary">{t}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {mode === "Related" ? (
          <ul className="flex flex-col gap-2">
            {RELATED.map((r) => (
              <li key={r}>
                <button className="lms-text-sm-medium w-full rounded-lg border border-lms-border-secondary px-3 py-2 text-left text-lms-text-primary hover:border-lms-border-primary">
                  {r}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {mode === "Ask" || mode === "Chat" ? (
          <div className="lms-text-sm-regular rounded-lg bg-lms-bg-secondary px-3 py-3 text-lms-text-secondary">
            {mode === "Ask"
              ? "Ask anything about this lesson — I’ll answer from the transcript."
              : "Hi! I can help you review this topic. What would you like to explore?"}
          </div>
        ) : null}
      </div>

      {mode === "Ask" || mode === "Chat" ? (
        <div className="flex items-center gap-2 border-t border-lms-border-secondary px-3 py-3">
          <input
            placeholder="Type a question…"
            className="lms-text-sm-regular flex-1 rounded-lg border border-lms-border-primary bg-lms-bg-primary px-3 py-2 text-lms-text-primary outline-none focus:border-lms-border-brand"
          />
          <button
            type="button"
            aria-label="Send"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-lms-bg-brand-solid text-lms-text-primary-on-brand"
          >
            <Icon icon={Send} size={18} />
          </button>
        </div>
      ) : null}
    </aside>
  );
}
