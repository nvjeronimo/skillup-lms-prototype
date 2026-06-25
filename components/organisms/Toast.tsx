"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ToastModel } from "@/lib/store";

export interface ToastProps {
  toast: ToastModel | null;
  onDone?: () => void;
  duration?: number;
  className?: string;
}

/**
 * Ephemeral toast (bookmark feedback + out-of-scope actions). Auto-dismiss after
 * `duration` (4s), paused while hovered. Optional inline action (e.g. Undo).
 * Announced via an aria-live polite region.
 */
export function Toast({ toast, onDone, duration = 4000, className }: ToastProps) {
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    if (!toast || hover) return;
    const t = window.setTimeout(() => onDone?.(), duration);
    return () => window.clearTimeout(t);
  }, [toast, hover, duration, onDone]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "sk-animate-fade fixed bottom-6 left-1/2 z-[70] flex w-[min(92vw,420px)] -translate-x-1/2 items-center gap-3 rounded-lg bg-sk-text-primary px-5 py-3 shadow-lg",
        className,
      )}
      style={{ boxShadow: "0 8px 24px color-mix(in srgb, var(--sk-text-primary) 16%, transparent)" }}
    >
      <Icon icon={Check} size={16} className="shrink-0 text-sk-fg-white" />
      <span className="sk-text-sm-medium flex-1 text-sk-fg-white">{toast.message}</span>
      {toast.actionLabel ? (
        <button
          type="button"
          onClick={() => {
            toast.onAction?.();
            onDone?.();
          }}
          className="sk-text-sm-semibold shrink-0 text-sk-fg-white underline underline-offset-2"
        >
          {toast.actionLabel}
        </button>
      ) : null}
    </div>
  );
}
