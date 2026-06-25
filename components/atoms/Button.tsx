import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive" | "utility";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  /** Render an icon-only square button (centers the icon, equal padding). */
  iconOnly?: boolean;
}

const VARIANT: Record<ButtonVariant, string> = {
  // Brand teal → yellow hover, dark-teal text on hover (handoff brand-aware rule).
  primary:
    "bg-sk-bg-brand-solid text-sk-text-primary-on-brand hover:bg-sk-bg-brand-hover hover:text-sk-text-brand-primary",
  // Outline teal.
  secondary:
    "bg-transparent border border-sk-border-brand text-sk-text-brand hover:bg-sk-bg-brand-section",
  // Ghost teal.
  tertiary: "bg-transparent text-sk-text-brand hover:bg-sk-bg-brand-section",
  // Utility / close-X stay UUI gray-neutral by design.
  destructive:
    "bg-transparent border border-sk-border-primary text-sk-text-error-primary hover:bg-sk-bg-error-primary",
  utility: "bg-sk-bg-secondary text-sk-text-secondary hover:bg-sk-bg-tertiary",
};

const SIZE: Record<ButtonSize, { pad: string; text: string; icon: number; square: string }> = {
  sm: { pad: "h-8 px-3 gap-1.5", text: "sk-text-sm-medium", icon: 16, square: "h-8 w-8" },
  md: { pad: "h-10 px-4 gap-2", text: "sk-text-sm-semibold", icon: 18, square: "h-10 w-10" },
  lg: { pad: "h-11 px-5 gap-2", text: "sk-text-md-semibold", icon: 20, square: "h-11 w-11" },
  xl: { pad: "h-12 px-6 gap-2", text: "sk-text-md-semibold", icon: 20, square: "h-12 w-12" },
};

/**
 * Brand-aware button. Primary teal / Secondary outline-teal / Tertiary ghost.
 * Destructive + utility stay UUI gray-neutral by design.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    leftIcon,
    rightIcon,
    iconOnly = false,
    className,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const s = SIZE[size];
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline-2",
        iconOnly ? s.square : s.pad,
        s.text,
        VARIANT[variant],
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...rest}
    >
      {leftIcon ? <Icon icon={leftIcon} size={s.icon} /> : null}
      {!iconOnly && children}
      {iconOnly && children}
      {rightIcon ? <Icon icon={rightIcon} size={s.icon} /> : null}
    </button>
  );
});
