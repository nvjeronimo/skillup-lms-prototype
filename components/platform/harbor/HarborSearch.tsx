"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { Icon } from "@/lib/icons";
import { openAssistant } from "@/lib/assistant/bus";
import { cn } from "@/lib/utils";

/**
 * Harbor's top-bar search (Nelson, 25 Oct 2026, after the DreamHost panel): one pale-blue pill in
 * the middle of the bar, the assistant's button inside it. Enter searches your courses (My
 * Learning, ?q=); Assistant asks the assistant what is typed, or just opens it. Open edX searches
 * one course at a time, so "your courses" means their titles, as My Learning's own search.
 */
export function HarborSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const id = React.useId();
  return (
    <form
      role="search"
      aria-label="Search your courses"
      onSubmit={(e) => {
        e.preventDefault();
        const text = q.trim();
        router.push(`/platform/my-learning?tab=courses${text ? `&q=${encodeURIComponent(text)}` : ""}`);
      }}
      className={cn(
        "flex h-12 w-full max-w-[420px] items-center gap-2 rounded-pill bg-sko-bg-track pl-4 ring-1 ring-inset ring-sko-border-default pr-1.5",
        "focus-within:shadow-[0_0_0_2px_var(--color-border-focus-gap),0_0_0_4px_var(--color-border-primary)]",
        className,
      )}
    >
      <Icon icon={Search} size={20} className="shrink-0 text-sko-icon-subtle" aria-hidden />
      <label htmlFor={id} className="sr-only">
        Search your courses or ask the assistant
      </label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        autoComplete="off"
        className="sk-text-body-large-regular min-w-0 flex-1 bg-transparent text-sko-text-default outline-none placeholder:text-sko-text-placeholder"
      />
      <button
        type="button"
        onClick={() => openAssistant(q)}
        aria-label={q.trim() ? `Ask the assistant: ${q.trim()}` : "Open the assistant"}
        className="sk-text-body-small-semibold inline-flex h-9 shrink-0 items-center gap-1.5 rounded-pill bg-sko-bg-page pl-4 pr-3 text-sko-text-default shadow-[var(--sk-shadow-harbor-pill)] transition-colors hover:bg-sko-bg-subtle"
      >
        Assistant
        <Icon icon={Sparkles} size={16} className="text-sko-icon-primary" aria-hidden />
      </button>
    </form>
  );
}
