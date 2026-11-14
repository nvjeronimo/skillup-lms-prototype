import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./Badge.module.css";

/**
 * Mirrors the DS `Badge` component (21889:541076): three axes, Style × Size × Color.
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
  /** The Label style (semibold) when true, in sentence case like every badge; otherwise the DS Medium label style. */
  eyebrow?: boolean;
  /**
   * A live session: a dot before the label that pulses (opacity, 1.2 s loop; still under
   * reduced motion). The label carries the state, so keep the word ("Live"). Use with
   * `color="success"`: live is green (decision 012).
   */
  live?: boolean;
}

/* ── Colour bindings, read from Badge Size=sm on 28 Sep 2026 ─────────────────────────
   One module class per Style × Color (Badge.module.css holds the DS variables: base fill,
   inside stroke, label colour); the icon and the Plain icon circle have their own. */
const COLORS: BadgeColor[] = ["gray", "brand", "info", "success", "warning", "error", "teal", "green", "red", "yellow"];
const byColor = (prefix: string) =>
  Object.fromEntries(COLORS.map((c) => [c, styles[prefix + c[0].toUpperCase() + c.slice(1)]])) as Record<BadgeColor, string>;

const SURFACE: Record<BadgeVariant, Record<BadgeColor, string>> = {
  soft: byColor("soft"),
  outline: byColor("outline"),
  modern: byColor("modern"),
  plain: byColor("plain"),
};

/* The leading icon has its own icon/* binding (it does not inherit the label colour).
   Status, brand, gray and info icons are the same in every Style; accents differ: Soft and
   Plain use icon/on-accent-* (Soft's icon sits on the strong pill fill, Plain's on the strong
   accent circle — see PLAIN_CIRCLE), Outline and Modern use icon/accent-*. */
const ICON_BASE = {
  gray: styles.iconGray,
  brand: styles.iconBrand,
  info: styles.iconInfo,
  success: styles.iconSuccess,
  warning: styles.iconWarning,
  error: styles.iconError,
};

const ICON_ON_ACCENT: Record<BadgeColor, string> = {
  ...ICON_BASE,
  teal: styles.iconOnAccentTeal,
  green: styles.iconOnAccentGreen,
  red: styles.iconOnAccentRed,
  yellow: styles.iconOnAccentYellow,
};

const ICON_ACCENT: Record<BadgeColor, string> = {
  ...ICON_BASE,
  teal: styles.iconAccentTeal,
  green: styles.iconAccentGreen,
  red: styles.iconAccentRed,
  yellow: styles.iconAccentYellow,
};

const ICON: Record<BadgeVariant, Record<BadgeColor, string>> = {
  soft: ICON_ON_ACCENT,
  outline: ICON_ACCENT,
  modern: ICON_ACCENT,
  plain: ICON_ON_ACCENT,
};

/* Style=Plain with a leading icon: the 12px icon sits in a 20×20 rounded-full circle filled
   with the colour's Soft-style fill ("icon in a soft circle", e.g. 21889:539962). */
const PLAIN_CIRCLE: Record<BadgeColor, string> = byColor("circle");

/* ── Geometry, from `_Badge base` (21889:2597) ───────────────────────────────────────────
   Pill sm: 22px, py 2, label 0/8, with a leading icon pl 6 · icon 12 · 6px gap · pr 8.
   Pill md: 24px, py 2, label 0/10, with a leading icon pl 8 · icon 12 · 4px gap · pr 10.
   Pill lg: 28px, py 4, label 0/12, with a leading icon pl 10 · icon 12 · 4px gap · pr 12.
   Plain: no padding, 6px gap, the 12px icon centred in a 20×20 soft circle. */
const PILL_SIZE: Record<BadgeSize, { label: string; icon: string; text: string }> = {
  sm: { label: styles.labelSm, icon: styles.iconSm, text: "sk-text-body-small-medium" },
  md: { label: styles.labelMd, icon: styles.iconMd, text: "sk-text-body-medium-medium" },
  lg: { label: styles.labelLg, icon: styles.iconLg, text: "sk-text-body-medium-medium" },
};

function resolveTone(tone: BadgeTone | undefined): { color?: BadgeColor; variant?: BadgeVariant } {
  if (!tone) return {};
  if (tone === "neutral") return { color: "gray" };
  if (tone === "outline") return { color: "gray", variant: "modern" };
  return { color: tone };
}

/** Generic badge (DS Badge). The typed LMS badge families compose this. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { color, variant, size = "sm", tone, leftIcon, eyebrow = false, live = false, className, children, ...rest },
  ref,
) {
  const fromTone = resolveTone(tone);
  const c: BadgeColor = color ?? fromTone.color ?? "gray";
  const v: BadgeVariant = variant ?? fromTone.variant ?? "soft";
  const plain = v === "plain";
  const geometry = PILL_SIZE[size];
  const textStyle = eyebrow ? cn("sk-text-label-small-semibold", styles.eyebrow) : geometry.text;

  return (
    <span
      ref={ref}
      className={cn(
        // A badge never wraps its label; the row it sits in wraps instead.
        styles.badge,
        plain ? styles.plain : cn(styles.pill, leftIcon ? geometry.icon : geometry.label),
        // Outline and Modern: 1px inside stroke (ring-inset keeps the DS height).
        (v === "outline" || v === "modern") && styles.stroked,
        textStyle,
        SURFACE[v][c],
        className,
      )}
      {...rest}
    >
      {leftIcon ? (
        plain ? (
          <span
            className={cn(
              styles.circle,
              PLAIN_CIRCLE[c],
            )}
          >
            <Icon icon={leftIcon} size={12} className={ICON[v][c]} />
          </span>
        ) : (
          <Icon icon={leftIcon} size={12} className={cn(styles.icon, ICON[v][c])} />
        )
      ) : null}
      {live ? <span aria-hidden className={cn("sk-live-dot", styles.liveDot, !plain && !leftIcon && styles.liveGap)} /> : null}
      {children}
    </span>
  );
});
