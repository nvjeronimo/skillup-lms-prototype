import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Mirrors the DS `Badge v2` component (21889:541076): three axes, Style × Size × Color.
 * Color covers the ten production options (Gray, Brand, Info, Success, Warning, Error,
 * Teal, Green, Red, Yellow). The eight provisional hues (Cyan…Orange) and Style=Soft Light
 * (bound to primitives, not roles) have no code counterpart yet.
 */
export type BadgeColor =
  | "gray"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "teal"
  | "green"
  | "red"
  | "yellow";

/** DS `Style`: Soft (fill, no stroke), Outline (soft fill + 1px stroke),
 *  Modern (page fill + 1px stroke), Plain (no box). */
export type BadgeVariant = "soft" | "outline" | "modern" | "plain";

/** DS `Size`: sm 22px, md 24px, lg 28px (Plain: 18px, 20px with an icon). */
export type BadgeSize = "sm" | "md" | "lg";

/**
 * @deprecated V1 prop that mixed colour and style. Use `color` + `variant`:
 * "neutral" → color="gray"; "outline" → variant="modern" color="gray" (the DS V1
 * `Type=Badge modern`, which is NOT the v2 Outline style). Other tones map 1:1 to `color`.
 */
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

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** DS `Color`. Defaults to "gray" (or to what the deprecated `tone` resolves to). */
  color?: BadgeColor;
  /** DS `Style`. Defaults to "soft". */
  variant?: BadgeVariant;
  /** DS `Size`. Defaults to "sm". */
  size?: BadgeSize;
  /** @deprecated Use `color` + `variant`. Kept so existing call sites keep rendering. */
  tone?: BadgeTone;
  leftIcon?: LucideIcon;
  /** 2xs uppercase eyebrow styling when true; otherwise the DS Medium label style. */
  eyebrow?: boolean;
}

/* ── Colour bindings, read from Badge v2 Size=sm on 28 Sep 2026 ─────────────────────────
   Every class below is the DS variable bound on that variant: base fill (bg-*), base
   stroke (ring-*), Text fill (text-sko-text-*) and icon vector (text-sko-icon-*). */

/* Style=Soft: fill + text, no stroke. Accents are the STRONG fills with on-accent text. */
const SOFT: Record<BadgeColor, string> = {
  gray: "bg-sko-bg-faint text-sko-text-muted",
  brand: "bg-sko-bg-primary-soft text-sko-text-primary",
  info: "bg-sko-bg-info-soft text-sko-text-info",
  success: "bg-sko-bg-success-soft text-sko-text-success",
  warning: "bg-sko-bg-warning-soft text-sko-text-warning",
  error: "bg-sko-bg-error-soft text-sko-text-error",
  teal: "bg-sko-bg-accent-teal text-sko-text-on-accent-teal",
  green: "bg-sko-bg-accent-green text-sko-text-on-accent-green",
  red: "bg-sko-bg-accent-red text-sko-text-on-accent-red",
  yellow: "bg-sko-bg-accent-yellow text-sko-text-on-accent-yellow",
};

/* Style=Outline: soft fill + 1px inside stroke. The DS binds the stroke to the TEXT token
   of the same colour (text/muted on Gray, text/primary on Brand…); mirrored as-is until
   DS-D1 decides whether these strokes move to border/* tokens. */
const OUTLINE: Record<BadgeColor, string> = {
  gray: "bg-sko-bg-faint ring-sko-text-muted text-sko-text-muted",
  brand: "bg-sko-bg-primary-soft ring-sko-text-primary text-sko-text-primary",
  info: "bg-sko-bg-info-soft ring-sko-text-info text-sko-text-info",
  success: "bg-sko-bg-success-soft ring-sko-text-success text-sko-text-success",
  warning: "bg-sko-bg-warning-soft ring-sko-text-warning text-sko-text-warning",
  error: "bg-sko-bg-error-soft ring-sko-text-error text-sko-text-error",
  teal: "bg-sko-bg-accent-teal-soft ring-sko-text-accent-teal text-sko-text-accent-teal",
  green: "bg-sko-bg-accent-green-soft ring-sko-text-accent-green text-sko-text-accent-green",
  red: "bg-sko-bg-accent-red-soft ring-sko-text-accent-red text-sko-text-accent-red",
  yellow: "bg-sko-bg-accent-yellow-soft ring-sko-text-accent-yellow text-sko-text-accent-yellow",
};

/* Style=Modern: page fill + 1px inside stroke on the colour's border token. */
const MODERN: Record<BadgeColor, string> = {
  gray: "bg-sko-bg-page ring-sko-border-default text-sko-text-muted",
  brand: "bg-sko-bg-page ring-sko-border-primary text-sko-text-primary",
  info: "bg-sko-bg-page ring-sko-border-info text-sko-text-info",
  success: "bg-sko-bg-page ring-sko-border-success text-sko-text-success",
  warning: "bg-sko-bg-page ring-sko-border-warning text-sko-text-warning",
  error: "bg-sko-bg-page ring-sko-border-error text-sko-text-error",
  teal: "bg-sko-bg-page ring-sko-border-accent-teal text-sko-text-accent-teal",
  green: "bg-sko-bg-page ring-sko-border-accent-green text-sko-text-accent-green",
  red: "bg-sko-bg-page ring-sko-border-accent-red text-sko-text-accent-red",
  yellow: "bg-sko-bg-page ring-sko-border-accent-yellow text-sko-text-accent-yellow",
};

/* Style=Plain: text only, no fill, no stroke. */
const PLAIN: Record<BadgeColor, string> = {
  gray: "text-sko-text-muted",
  brand: "text-sko-text-primary",
  info: "text-sko-text-info",
  success: "text-sko-text-success",
  warning: "text-sko-text-warning",
  error: "text-sko-text-error",
  teal: "text-sko-text-accent-teal",
  green: "text-sko-text-accent-green",
  red: "text-sko-text-accent-red",
  yellow: "text-sko-text-accent-yellow",
};

const SURFACE: Record<BadgeVariant, Record<BadgeColor, string>> = {
  soft: SOFT,
  outline: OUTLINE,
  modern: MODERN,
  plain: PLAIN,
};

/* The leading icon has its own icon/* binding (it does not inherit the label colour).
   Status, brand, gray and info icons are the same in every Style; accents differ: Soft uses
   icon/on-accent-* (it sits on the strong fill), Outline and Modern use icon/accent-*.
   Plain: the DS binds icon/on-accent-* too, but with no fill that token is pure white on
   bg/page in Light (an invisible icon), so Plain follows Outline/Modern here — flagged
   as a DS binding defect. */
const ICON_BASE = {
  gray: "text-sko-icon-subtle",
  brand: "text-sko-icon-primary",
  info: "text-sko-icon-info",
  success: "text-sko-icon-success",
  warning: "text-sko-icon-warning",
  error: "text-sko-icon-error",
} as const;

const ICON_ON_ACCENT: Record<BadgeColor, string> = {
  ...ICON_BASE,
  teal: "text-sko-icon-on-accent-teal",
  green: "text-sko-icon-on-accent-green",
  red: "text-sko-icon-on-accent-red",
  yellow: "text-sko-icon-on-accent-yellow",
};

const ICON_ACCENT: Record<BadgeColor, string> = {
  ...ICON_BASE,
  teal: "text-sko-icon-accent-teal",
  green: "text-sko-icon-accent-green",
  red: "text-sko-icon-accent-red",
  yellow: "text-sko-icon-accent-yellow",
};

const ICON: Record<BadgeVariant, Record<BadgeColor, string>> = {
  soft: ICON_ON_ACCENT,
  outline: ICON_ACCENT,
  modern: ICON_ACCENT,
  plain: ICON_ACCENT,
};

/* ── Geometry, from `_Badge base` (21889:2597) ───────────────────────────────────────────
   Pill sm: 22px, py 2, label 0/8, with a leading icon pl 6 · icon 12 · 6px gap · pr 8.
   Pill md: 24px, py 2, label 0/10, with a leading icon pl 8 · icon 12 · 4px gap · pr 10.
   Pill lg: 28px, py 4, label 0/12, with a leading icon pl 10 · icon 12 · 4px gap · pr 12.
   Plain: no padding, 6px gap, the 12px icon centred in a 20×20 container. */
const PILL_SIZE: Record<BadgeSize, { label: string; icon: string; text: string }> = {
  sm: { label: "py-0.5 px-2", icon: "py-0.5 pl-1.5 pr-2 gap-1.5", text: "sk-text-xs-medium" },
  md: { label: "py-0.5 px-2.5", icon: "py-0.5 pl-2 pr-2.5 gap-1", text: "sk-text-sm-medium" },
  lg: { label: "py-1 px-3", icon: "py-1 pl-2.5 pr-3 gap-1", text: "sk-text-sm-medium" },
};

function resolveTone(tone: BadgeTone | undefined): { color?: BadgeColor; variant?: BadgeVariant } {
  if (!tone) return {};
  if (tone === "neutral") return { color: "gray" };
  if (tone === "outline") return { color: "gray", variant: "modern" };
  return { color: tone };
}

/** Generic badge (DS Badge v2). The typed LMS badge families compose this. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { color, variant, size = "sm", tone, leftIcon, eyebrow = false, className, children, ...rest },
  ref,
) {
  const fromTone = resolveTone(tone);
  const c: BadgeColor = color ?? fromTone.color ?? "gray";
  const v: BadgeVariant = variant ?? fromTone.variant ?? "soft";
  const plain = v === "plain";
  const geometry = PILL_SIZE[size];
  const textStyle = eyebrow ? "sk-text-2xs-semibold" : geometry.text;

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center",
        plain
          ? "gap-1.5"
          : cn("rounded-full", leftIcon ? geometry.icon : geometry.label),
        // Outline and Modern: 1px inside stroke (ring-inset keeps the DS height).
        (v === "outline" || v === "modern") && "ring-1 ring-inset",
        textStyle,
        SURFACE[v][c],
        className,
      )}
      {...rest}
    >
      {leftIcon ? (
        plain ? (
          <span className="inline-flex size-5 shrink-0 items-center justify-center">
            <Icon icon={leftIcon} size={12} className={ICON[v][c]} />
          </span>
        ) : (
          <Icon icon={leftIcon} size={12} className={cn("shrink-0", ICON[v][c])} />
        )
      ) : null}
      {children}
    </span>
  );
});
