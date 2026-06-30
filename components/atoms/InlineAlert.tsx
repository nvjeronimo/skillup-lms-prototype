import * as React from "react";
import { AlertCircle, AlertTriangle, Check, RotateCw, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type AlertTone = "info" | "success" | "warning" | "error";

export interface InlineAlertProps {
  tone?: AlertTone;
  title: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
}

const TONE: Record<AlertTone, { box: string; circle: string; icon: LucideIcon }> = {
  info: {
    box: "bg-sk-bg-brand-section border-sk-border-brand",
    circle: "bg-sk-bg-brand-solid",
    icon: RotateCw,
  },
  success: {
    box: "bg-sk-bg-success-primary border-sk-text-success-primary",
    circle: "bg-sk-bg-success-solid",
    icon: Check,
  },
  warning: {
    box: "bg-sk-bg-warning-primary border-sk-text-warning-primary",
    circle: "bg-sk-bg-warning-solid",
    icon: AlertTriangle,
  },
  error: {
    box: "bg-sk-bg-error-primary border-sk-text-error-primary",
    circle: "bg-sk-bg-error-solid",
    icon: AlertCircle,
  },
};

/** Inline notification — filled circle icon + title (+ description). Matches DS. */
export function InlineAlert({ tone = "info", title, description, onDismiss, className }: InlineAlertProps) {
  const t = TONE[tone];
  return (
    <div
      role="status"
      className={cn("flex items-start gap-3 rounded-lg border px-4 py-3", t.box, className)}
    >
      <span
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sk-fg-white",
          t.circle,
        )}
      >
        <Icon icon={t.icon} size={16} />
      </span>
      <div className="flex-1 pt-0.5">
        <p className="sk-text-sm-semibold text-sk-text-primary">{title}</p>
        {description ? (
          <p className="sk-text-sm-regular mt-0.5 text-sk-text-secondary">{description}</p>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 pt-0.5 text-sk-text-tertiary hover:text-sk-text-primary"
        >
          <Icon icon={X} size={18} />
        </button>
      ) : null}
    </div>
  );
}
