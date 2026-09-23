import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "neutral" | "destructive" | "utility";
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
    "bg-sko-bg-primary text-sko-text-on-primary hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover",
  // Outline teal.
  secondary:
    "bg-transparent border border-sko-border-primary text-sko-text-primary hover:bg-sko-bg-primary-soft",
  // Ghost teal.
  tertiary: "bg-transparent text-sko-text-primary hover:bg-sko-bg-primary-soft",
  // Neutral outline (DS Tertiary + border-primary stroke, text-tertiary) — e.g. footer "Previous".
  neutral: "bg-transparent border border-sko-border-default text-sko-text-subtle hover:bg-sko-bg-subtle",
  // Utility / close-X stay UUI gray-neutral by design.
  destructive:
    "bg-transparent border border-sko-border-default text-sko-text-error hover:bg-sko-bg-error-soft",
  utility: "bg-sko-bg-subtle text-sko-text-muted hover:bg-sko-bg-muted",
};

const SIZE: Record<ButtonSize, { pad: string; text: string; icon: number; square: string }> = {
  // DS Buttons/Button Size=sm: 36px (8/12 padding), Body/Small/Semibold, 4px gap, 20px icon.
  sm: { pad: "h-9 px-3 gap-1", text: "sk-text-sm-semibold", icon: 20, square: "h-9 w-9" },
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
