"use client";

import * as React from "react";
import { CheckCircle2, Info, OctagonAlert, TriangleAlert, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ToastModel } from "@/lib/store";
import { useExitTransition, useFrozenWhileClosed } from "@/lib/useExitTransition";
import { MOTION_MS } from "@/lib/motion/tokens";
import { inertProps } from "@/lib/inert";

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
 * polite region. It rises in and sinks back out; while it leaves, the store has already
 * cleared it, so the last toast is kept to draw the exit.
 */
export function Toast({
  toast: incoming,
  onDone,
  duration = 4000,
  showClose = true,
  className,
}: ToastProps) {
  const [hover, setHover] = React.useState(false);
  const { mounted, state, onAnimationEnd } = useExitTransition(!!incoming, MOTION_MS.short3);
  // The last toast shown, used only while `incoming` is null (the exit). A toast that arrives
  // during the exit is drawn at once: `incoming` wins whenever it is set.
  const toast = useFrozenWhileClosed(incoming, !!incoming);

  // A toast that leaves under the pointer never gets its mouseleave: do not carry the pause
  // over to the next toast.
  React.useEffect(() => {
    if (!incoming) setHover(false);
  }, [incoming]);

  React.useEffect(() => {
    if (!incoming || hover) return;
    const t = window.setTimeout(() => onDone?.(), duration);
    return () => window.clearTimeout(t);
  }, [incoming, hover, duration, onDone]);

  if (!mounted || !toast) return null;
  const closed = state === "closed";

  const tone = TONE[toast.tone ?? "neutral"];

  return (
    // The wrapper centres; the toast inside animates, so the keyframe transform does not
    // override the -translate-x-1/2. The live region sits on the wrapper: useDialog leaves
    // `role="status"` siblings un-inert, so toasts are still announced over a dialog.
    <div
      role="status"
      aria-live="polite"
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      className={cn(
        "fixed bottom-6 left-1/2 z-[70] w-[min(92vw,420px)] -translate-x-1/2",
        closed && "pointer-events-none",
      )}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onAnimationEnd={onAnimationEnd}
        className={cn(
          "sk-animate-rise flex w-full items-start gap-5 rounded-xl border p-4 shadow",
          tone.box,
          className,
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <Icon icon={tone.icon} size={20} className={cn("shrink-0", tone.fg)} />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-col gap-1">
              {toast.title ? (
                <p className="sk-text-body-medium-semibold text-sko-text-default">{toast.title}</p>
              ) : null}
              <p className="sk-text-body-medium-medium text-sko-text-muted">{toast.message}</p>
            </div>
            {toast.actionLabel ? (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  onDone?.();
                }}
                className="sk-text-body-medium-semibold self-start text-sko-text-subtle"
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
    </div>
  );
}
