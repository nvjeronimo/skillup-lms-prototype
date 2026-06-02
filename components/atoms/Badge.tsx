import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type BadgeTone = "brand" | "neutral" | "success" | "warning" | "error" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  leftIcon?: LucideIcon;
  /** 2xs uppercase eyebrow styling when true; otherwise xs medium. */
  eyebrow?: boolean;
}

const TONE: Record<BadgeTone, string> = {
  brand: "bg-lms-bg-brand-section text-lms-text-brand-secondary",
  neutral: "bg-lms-bg-secondary text-lms-text-secondary",
  success: "bg-lms-bg-success-primary text-lms-text-success-primary",
  warning: "bg-lms-bg-warning-primary text-lms-text-warning-primary",
  error: "bg-lms-bg-error-primary text-lms-text-error-primary",
  outline: "bg-lms-bg-primary text-lms-text-secondary border border-lms-border-primary",
};

/** Generic pill. The typed badge families below compose this. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "neutral", leftIcon, eyebrow = false, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5",
        eyebrow ? "lms-text-2xs-semibold" : "lms-text-xs-medium",
        TONE[tone],
        className,
      )}
      {...rest}
    >
      {leftIcon ? <Icon icon={leftIcon} size={12} /> : null}
      {children}
    </span>
  );
});
