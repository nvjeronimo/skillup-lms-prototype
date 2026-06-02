import * as React from "react";
import { AlertTriangle, Check, Info, X } from "lucide-react";
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

const TONE: Record<AlertTone, { wrap: string; icon: LucideIcon; iconColor: string }> = {
  info: {
    wrap: "bg-lms-bg-brand-section border-lms-border-brand text-lms-text-brand-secondary",
    icon: Info,
    iconColor: "text-lms-text-brand-secondary",
  },
  success: {
    wrap: "bg-lms-bg-success-primary border-lms-text-success-primary text-lms-text-success-primary",
    icon: Check,
    iconColor: "text-lms-text-success-primary",
  },
  warning: {
    wrap: "bg-lms-bg-warning-primary border-lms-text-warning-primary text-lms-text-warning-primary",
    icon: AlertTriangle,
    iconColor: "text-lms-text-warning-primary",
  },
  error: {
    wrap: "bg-lms-bg-error-primary border-lms-text-error-primary text-lms-text-error-primary",
    icon: AlertTriangle,
    iconColor: "text-lms-text-error-primary",
  },
};

/** Inline notification — info / success / warning / error. */
export function InlineAlert({ tone = "info", title, description, onDismiss, className }: InlineAlertProps) {
  const t = TONE[tone];
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3",
        t.wrap,
        className,
      )}
    >
      <span className={cn("mt-0.5 shrink-0", t.iconColor)}>
        <Icon icon={t.icon} size={18} />
      </span>
      <div className="flex-1">
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
          className="shrink-0 text-lms-text-tertiary hover:text-lms-text-primary"
        >
          <Icon icon={X} size={18} />
        </button>
      ) : null}
    </div>
  );
}
