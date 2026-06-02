"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string | null;
  onDone?: () => void;
  duration?: number;
  className?: string;
}

/** Ephemeral toast for out-of-scope actions (AI, theme, downloads). */
export function Toast({ message, onDone, duration = 2200, className }: ToastProps) {
  React.useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => onDone?.(), duration);
    return () => window.clearTimeout(t);
  }, [message, duration, onDone]);

  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "lms-animate-fade fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-lms-bg-brand-solid px-4 py-2.5 shadow-lg",
        className,
      )}
    >
      <span className="lms-text-sm-medium text-lms-text-primary-on-brand">{message}</span>
    </div>
  );
}
