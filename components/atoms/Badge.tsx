import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Mirrors the DS Badge `Color` property (Gray, Brand, Error, Warning, Success, Teal, Red, Yellow);
 *  "outline" is the DS `Type=Badge modern` treatment. */
export type BadgeTone =
  | "brand"
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "teal"
  | "red"
  | "yellow"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  leftIcon?: LucideIcon;
  /** 2xs uppercase eyebrow styling when true; otherwise xs medium. */
  eyebrow?: boolean;
}

/* Fill, 1px inside stroke (ring-inset keeps the DS 22px height) and text, as bound in the DS
   Badge `Type=Badge color` variants. Accent colours stroke with their own soft fill, as in the DS. */
const TONE: Record<BadgeTone, string> = {
  brand: "bg-sko-bg-primary-soft ring-sko-border-primary-soft text-sko-text-primary",
  neutral: "bg-sko-bg-faint ring-sko-border-subtle text-sko-text-muted",
  success: "bg-sko-bg-success-soft ring-sko-border-success-soft text-sko-text-success",
  warning: "bg-sko-bg-warning-soft ring-sko-border-warning-soft text-sko-text-warning",
  error: "bg-sko-bg-error-soft ring-sko-border-error-soft text-sko-text-error",
  teal: "bg-sko-bg-accent-teal-soft ring-sko-bg-accent-teal-soft text-sko-text-accent-teal",
  red: "bg-sko-bg-accent-red-soft ring-sko-bg-accent-red-soft text-sko-text-accent-red",
  yellow: "bg-sko-bg-accent-yellow-soft ring-sko-bg-accent-yellow-soft text-sko-text-accent-yellow",
  outline: "bg-sko-bg-page ring-sko-border-default text-sko-text-muted",
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
        // DS Badge sm: 22px high, radius 6, padding 2/6 (2/8/2/6 with a leading icon), 2px icon gap
        "inline-flex items-center gap-0.5 rounded-md py-0.5 ring-1 ring-inset",
        leftIcon ? "pl-1.5 pr-2" : "px-1.5",
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
