"use client";

import * as React from "react";
import { CheckCircle2, Info, OctagonAlert, TriangleAlert, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ToastModel } from "@/lib/store";

/** DS `Toast` Color property: Neutral | Success | Warning | Critical | Info. */
export type ToastTone = "neutral" | "success" | "warning" | "error" | "info";

/**
 * What the toast shows. Extends the store's `ToastModel` with the DS fields
 * the store does not carry yet: `tone` (defaults to `neutral`; pass `success`
 * only for real confirmations) and an optional `title` above the message.
 */
export interface ToastContent extends ToastModel {
  tone?: ToastTone;
  title?: string;
}

export interface ToastProps {
  toast: ToastContent | null;
  onDone?: () => void;
  duration?: number;
  /** DS `Show close button` (default true). The X calls `onDone`. */
  showClose?: boolean;
  className?: string;
}

/**
 * DS `Toast` (node 21089-1214): per-tone soft surface + 1px soft border,
 * radius 12, padding 16, Elevation/level2 (Tailwind `shadow`).
 */
const TONE: Record<ToastTone, { box: string; icon: LucideIcon; fg: string }> = {
  success: {
    box: "bg-sko-bg-success-soft border-sko-border-success-soft",
    icon: CheckCircle2,
    // Not the DS binding (icon/success-strong, 2.81:1 on bg/success-soft and
    // not remapped by data-vision=cvd); icon/success passes 3:1 in both themes.
    // DS rebind pending: toast-ds-icon-tokens.
    fg: "text-sko-icon-success",
  },
  info: {
    box: "bg-sko-bg-primary-soft border-sko-border-primary-muted",
    icon: Info,
    fg: "text-sko-icon-primary",
  },
  neutral: {
    box: "bg-sko-bg-faint border-sko-border-subtle",
    icon: Info,
    fg: "text-sko-icon-muted",
  },
  warning: {
    box: "bg-sko-bg-warning-soft border-sko-border-warning-soft",
    icon: TriangleAlert,
    fg: "text-sko-icon-warning",
  },
  error: {
    box: "bg-sko-bg-error-soft border-sko-border-error-soft",
    icon: OctagonAlert,
    fg: "text-sko-icon-error",
  },
};

/**
 * Ephemeral toast (bookmark feedback + out-of-scope actions). Auto-dismiss after
 * `duration` (4s), paused while hovered; can also be closed with the X.
 * Optional action (e.g. Undo) under the text. Announced via an aria-live
 * polite region.
 */
export function Toast({ toast, onDone, duration = 4000, showClose = true, className }: ToastProps) {
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    if (!toast || hover) return;
    const t = window.setTimeout(() => onDone?.(), duration);
    return () => window.clearTimeout(t);
  }, [toast, hover, duration, onDone]);

  if (!toast) return null;

  const tone = TONE[toast.tone ?? "neutral"];

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "sk-animate-fade fixed bottom-6 left-1/2 z-[70] flex w-[min(92vw,420px)] -translate-x-1/2 items-start gap-5 rounded-xl border p-4 shadow",
        tone.box,
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <Icon icon={tone.icon} size={20} className={cn("shrink-0", tone.fg)} />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-col gap-1">
            {toast.title ? (
              <p className="sk-text-sm-semibold text-sko-text-default">{toast.title}</p>
            ) : null}
            <p className="sk-text-sm-medium text-sko-text-muted">{toast.message}</p>
          </div>
          {toast.actionLabel ? (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                onDone?.();
              }}
              className="sk-text-sm-semibold self-start text-sko-text-subtle"
            >
              {toast.actionLabel}
            </button>
          ) : null}
        </div>
      </div>
      {showClose ? (
        <button type="button" aria-label="Dismiss" onClick={onDone} className="shrink-0">
          <Icon icon={X} size={20} className="text-sko-icon-muted" />
        </button>
      ) : null}
    </div>
  );
}
