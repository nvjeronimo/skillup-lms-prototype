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
    box: "bg-lms-bg-brand-section border-lms-border-brand",
    circle: "bg-lms-fg-progress",
    icon: RotateCw,
  },
  success: {
    box: "bg-lms-bg-success-primary border-lms-text-success-primary",
    circle: "bg-lms-text-success-primary",
    icon: Check,
  },
  warning: {
    box: "bg-lms-bg-warning-primary border-lms-text-warning-primary",
    circle: "bg-lms-text-warning-primary",
    icon: AlertTriangle,
  },
  error: {
    box: "bg-lms-bg-error-primary border-lms-text-error-primary",
    circle: "bg-lms-text-error-primary",
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
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lms-fg-white",
          t.circle,
        )}
      >
        <Icon icon={t.icon} size={16} />
      </span>
      <div className="flex-1 pt-0.5">
        <p className="lms-text-sm-semibold text-lms-text-primary">{title}</p>
        {description ? (
          <p className="lms-text-sm-regular mt-0.5 text-lms-text-secondary">{description}</p>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 pt-0.5 text-lms-text-tertiary hover:text-lms-text-primary"
        >
          <Icon icon={X} size={18} />
        </button>
      ) : null}
    </div>
  );
}
