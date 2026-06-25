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
  brand: "bg-sk-bg-brand-section text-sk-text-brand-secondary",
  neutral: "bg-sk-bg-secondary text-sk-text-secondary",
  success: "bg-sk-bg-success-primary text-sk-text-success-primary",
  warning: "bg-sk-bg-warning-primary text-sk-text-warning-primary",
  error: "bg-sk-bg-error-primary text-sk-text-error-primary",
  outline: "bg-sk-bg-primary text-sk-text-secondary border border-sk-border-primary",
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
        eyebrow ? "sk-text-2xs-semibold" : "sk-text-xs-medium",
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
