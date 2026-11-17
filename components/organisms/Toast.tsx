import * as React from "react";
import { CheckCircle2, Info, OctagonAlert, TriangleAlert, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ToastModel } from "@/lib/store";
import { useExitTransition, useFrozenWhileClosed } from "@/lib/useExitTransition";
import { MOTION_MS } from "@/lib/motion/tokens";
import { inertProps } from "@/lib/inert";
import styles from "./Toast.module.css";

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
 * DS `Toast` v1.1 (node 21089-1214): per-tone soft surface + 1px soft border,
 * radius 12, padding 16, Elevation/level2 (Tailwind `shadow`).
 */
const TONE: Record<ToastTone, { box: string; icon: LucideIcon; fg: string }> = {
  success: {
    box: styles.success,
    icon: CheckCircle2,
    // icon/success, as in the DS since Toast v1.1 (14 Oct 2026): it passes 3:1
    // in both themes; icon/success-strong was 2.81:1 on bg/success-soft.
    fg: styles.iconSuccess,
  },
  info: {
    box: styles.info,
    icon: Info,
    fg: styles.iconInfo,
  },
  neutral: {
    box: styles.neutral,
    icon: Info,
    fg: styles.iconNeutral,
  },
  warning: {
    box: styles.warning,
    icon: TriangleAlert,
    fg: styles.iconWarning,
  },
  error: {
    box: styles.error,
    icon: OctagonAlert,
    fg: styles.iconError,
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
        styles.wrapper,
        closed && styles.closed,
      )}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onAnimationEnd={onAnimationEnd}
        className={cn(
          "sk-animate-rise",
          styles.toast,
          tone.box,
          className,
        )}
      >
        <div className={styles.main}>
          <Icon icon={tone.icon} size={20} className={cn(styles.icon, tone.fg)} />
          <div className={styles.content}>
            <div className={styles.text}>
              {toast.title ? (
                <p className={`sk-text-body-medium-semibold ${styles.title}`}>{toast.title}</p>
              ) : null}
              <p className={`sk-text-body-medium-medium ${styles.message}`}>{toast.message}</p>
            </div>
            {toast.actionLabel ? (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  onDone?.();
                }}
                className={`sk-text-body-medium-semibold ${styles.action}`}
              >
                {toast.actionLabel}
              </button>
            ) : null}
          </div>
        </div>
        {showClose ? (
          <button type="button" aria-label="Dismiss" onClick={onDone} className={styles.dismiss}>
            <Icon icon={X} size={20} className={styles.dismissIcon} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
