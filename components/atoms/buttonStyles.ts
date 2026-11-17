/* The DS Button's props and classes, with no client code: atoms/ButtonLink (which may render
   on the server) reads its classes from here. atoms/Button re-exports all of it. */
import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

/** DS Button `Type` (Button / Link Button / Icon Button). */
export type ButtonTone = "brand" | "destructive" | "success";
/**
 * DS Button `Hierarchy`. Primary/Secondary/Tertiary are Button; `link` and
 * `link-subtle` are Link Button Hierarchy=Primary and Hierarchy=Secondary (the grey link).
 */
export type ButtonHierarchy = "primary" | "secondary" | "tertiary" | "link" | "link-subtle";
/**
 * @deprecated Use `tone` + `hierarchy`. Kept so existing call sites keep working:
 * primary/secondary/tertiary → Brand. `neutral`, `destructive` and `utility` keep their own
 * styles: `neutral` has no Button equivalent yet, and destructive + utility stay UUI
 * gray-neutral by design (decision 003). `tone="destructive"` gives the V2 Destructive styles.
 */
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "neutral" | "destructive" | "utility";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** DS `Type`. Defaults to `brand`. */
  tone?: ButtonTone;
  /** DS `Hierarchy`. Defaults to `primary`. Wins over `variant` when both are set. */
  hierarchy?: ButtonHierarchy;
  /** @deprecated Use `tone` + `hierarchy`. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  /** Render an icon-only square button (DS Icon Button): 20px icon at sm/md, 24px at lg/xl. */
  iconOnly?: boolean;
  /**
   * DS State=Loading: a spinner takes the leading-icon slot and the label stays visible.
   * The button keeps its tone colours (no native `disabled`), is marked aria-busy and
   * aria-disabled, and ignores clicks.
   */
  loading?: boolean;
  /**
   * The work behind `loading` succeeded. When `loading` turns false while this is true, a
   * check draws itself in the spinner's slot for 1.2 s, then the button returns to normal.
   * The width captured when loading started holds until then.
   */
  done?: boolean;
}

/* Colour per Type × Hierarchy, as bound in Button 21851:7608 and Link Button 21851:7679: the
   module classes of Button.module.css (which holds the rules and their notes). Strokes are
   inset rings (`outline`) with a real border under forced colors (`forcedBorder`). */
const PRIMARY_DISABLED = styles.primaryDisabled;
const OUTLINE_DISABLED = styles.outlineDisabled;
const GHOST_DISABLED = styles.ghostDisabled;
/* Brand icons take icon/primary while enabled; disabled icons inherit the label colour. */
const BRAND_ICON = styles.iconPrimary;
/* Link Button: a 1px bottom stroke on the icon token of its tone; radius 0; focused bg/faint.
   sk-link-button: under "larger targets" its 44 is a hit area around it (globals.css), not its
   height, so the line stays 4 under the label as in the DS (Nelson, 23 Oct 2026). */
const LINK = cn("sk-link-button", styles.link);
const LINK_TONE = {
  brand: cn(styles.linkBrand, styles.iconDefaultOnHover),
  subtle: styles.linkSubtle,
  destructive: styles.linkDestructive,
  success: styles.linkSuccess,
};

/* The outline buttons on hover: every type fills with its own soft colour and keeps its text
   and icon colours (Nelson, 12 Oct 2026). The Icon Button does the same since that evening. */
const OUTLINE_HOVER: Record<ButtonTone, string> = {
  brand: styles.hoverBrand,
  destructive: styles.hoverDestructive,
  success: styles.hoverSuccess,
};
/* The icons of the Destructive and Success outline buttons take their icon token, as the
   Brand ones do (DS, 12 Oct 2026). */
const ERROR_ICON = styles.iconError;
const SUCCESS_ICON = styles.iconSuccess;
/* An inside stroke, and its real border under forced colors. */
const OUTLINE = cn(styles.stroke, styles.forcedBorder);

const VARIANT: Record<ButtonTone, Record<ButtonHierarchy, string>> = {
  brand: {
    primary: cn(styles.brandPrimary, PRIMARY_DISABLED),
    secondary: cn(styles.brandSecondary, OUTLINE, BRAND_ICON, OUTLINE_DISABLED),
    tertiary: cn(styles.brandTertiary, BRAND_ICON, GHOST_DISABLED),
    link: cn(LINK, LINK_TONE.brand, BRAND_ICON),
    "link-subtle": cn(LINK, LINK_TONE.subtle),
  },
  destructive: {
    primary: cn(styles.destructivePrimary, PRIMARY_DISABLED),
    secondary: cn(styles.destructiveSecondary, OUTLINE, ERROR_ICON, OUTLINE_DISABLED),
    // No Destructive/Tertiary in the DS: falls back to Destructive/Secondary.
    tertiary: cn(styles.destructiveSecondary, OUTLINE, ERROR_ICON, OUTLINE_DISABLED),
    link: cn(LINK, LINK_TONE.destructive),
    // The grey link exists only as Brand/Secondary.
    "link-subtle": cn(LINK, LINK_TONE.subtle),
  },
  success: {
    // The icon colours (on-success, success on hover) ride on successPrimary itself.
    primary: cn(styles.successPrimary, PRIMARY_DISABLED),
    secondary: cn(styles.successSecondary, OUTLINE, SUCCESS_ICON, OUTLINE_DISABLED),
    // No Success/Tertiary in the DS: falls back to Success/Secondary.
    tertiary: cn(styles.successSecondary, OUTLINE, SUCCESS_ICON, OUTLINE_DISABLED),
    link: cn(LINK, LINK_TONE.success),
    "link-subtle": cn(LINK, LINK_TONE.subtle),
  },
};

/* Styles kept outside Button: `neutral` has no equivalent in it yet (the ICP cases it misses);
   `destructive` and `utility` stay UUI gray-neutral by design (decision 003). No DS disabled
   state exists for them, so they keep the 50% opacity. */
type LegacyStyle = "neutral" | "destructive" | "utility";
const isLegacyStyle = (v: ButtonVariant | undefined): v is LegacyStyle =>
  v === "neutral" || v === "destructive" || v === "utility";
const LEGACY: Record<LegacyStyle, string> = {
  // Neutral grey outline, e.g. the footer "Previous".
  neutral: cn(styles.legacyNeutral, OUTLINE),
  // Grey stroke, red label, error-soft hover, e.g. LiveControlBar "Leave session".
  destructive: cn(styles.legacyDestructive, OUTLINE),
  utility: styles.legacyUtility,
};

const VARIANT_ALIAS: Record<Exclude<ButtonVariant, LegacyStyle>, { tone: ButtonTone; hierarchy: ButtonHierarchy }> = {
  primary: { tone: "brand", hierarchy: "primary" },
  secondary: { tone: "brand", hierarchy: "secondary" },
  tertiary: { tone: "brand", hierarchy: "tertiary" },
};

/* DS State=Focused: a 2px border/focus-gap, then a 2px ring in the tone colour (--btn-ring). */
const FOCUS_RING: Record<ButtonTone, string> = {
  brand: styles.ringBrand,
  destructive: styles.ringDestructive,
  success: styles.ringSuccess,
};

/* ._Button_Structure 21851:7567 and ._Icon Button_Structure 21851:7599 (sizes in the module).
   The label sits in a 2px "Text padding" frame, rendered as the label span in Button. */
const SIZE: Record<
  ButtonSize,
  { pad: string; text: string; icon: number; square: string; squareIcon: number; squareSvg: string }
> = {
  // 36 tall, 8/12 padding, 4 gap, body-medium/Semibold, 20 icon.
  sm: { pad: styles.sm, text: "sk-text-body-medium-semibold", icon: 20, square: styles.squareSm, squareIcon: 20, squareSvg: styles.squareSvgSm },
  // 44 tall, 12/12 padding, 4 gap, body-medium/Semibold, 20 icon.
  md: { pad: styles.md, text: "sk-text-body-medium-semibold", icon: 20, square: styles.squareMd, squareIcon: 20, squareSvg: styles.squareSvgSm },
  // 48 tall, 12/16 padding, 6 gap, body-large/Semibold, 20 icon (24 icon-only).
  lg: { pad: styles.lg, text: "sk-text-body-large-semibold", icon: 20, square: styles.squareLg, squareIcon: 24, squareSvg: styles.squareSvgLg },
  // 56 tall, 16/20 padding, 6 gap, body-large/Semibold, 20 icon (24 icon-only).
  xl: { pad: styles.xl, text: "sk-text-body-large-semibold", icon: 20, square: styles.squareXl, squareIcon: 24, squareSvg: styles.squareSvgLg },
};

/* ._Link Button_Structure 21851:7588: sm 26 (body-small), md 28, lg 32 (xl maps to lg). */
const LINK_SIZE: Record<ButtonSize, { pad: string; text: string; icon: number }> = {
  sm: { pad: styles.linkSm, text: "sk-text-body-small-semibold", icon: 16 },
  md: { pad: styles.linkMd, text: "sk-text-body-medium-semibold", icon: 16 },
  lg: { pad: styles.linkLg, text: "sk-text-body-large-semibold", icon: 20 },
  xl: { pad: styles.linkLg, text: "sk-text-body-large-semibold", icon: 20 },
};

export interface ButtonStyleProps {
  tone?: ButtonTone;
  hierarchy?: ButtonHierarchy;
  /** @deprecated Use `tone` + `hierarchy`. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  loading?: boolean;
  className?: string;
}

/* Resolves the deprecated `variant` against tone + hierarchy: what both exports below read. */
function resolveButton({ tone, hierarchy, variant }: Pick<ButtonStyleProps, "tone" | "hierarchy" | "variant">) {
  const legacy: LegacyStyle | null =
    hierarchy === undefined && tone === undefined && isLegacyStyle(variant) ? variant : null;
  const alias = variant && !isLegacyStyle(variant) ? VARIANT_ALIAS[variant] : undefined;
  // A legacy `destructive` mixed with tone/hierarchy props falls back to the V2 Destructive tone.
  const t: ButtonTone = tone ?? alias?.tone ?? (variant === "destructive" ? "destructive" : "brand");
  const h: ButtonHierarchy = hierarchy ?? alias?.hierarchy ?? "primary";
  const isLink = legacy === null && (h === "link" || h === "link-subtle");
  return { legacy, t, h, isLink };
}

/**
 * The classes of a DS Button for a set of visual props. Pure, so anything that must look
 * like a button without being a <button> (atoms/ButtonLink) renders the same classes.
 */
export function buttonClassName({
  tone,
  hierarchy,
  variant,
  size = "md",
  iconOnly = false,
  loading = false,
  className,
}: ButtonStyleProps = {}): string {
  const { legacy, t, h, isLink } = resolveButton({ tone, hierarchy, variant });
  const s = SIZE[size];
  const l = LINK_SIZE[size];
  return cn(
    // Press: a .98 scale in short2 (motion-matrix §7.6). sk-press-scale marks the pressable.
    "sk-press-scale",
    styles.button,
    FOCUS_RING[legacy === "destructive" ? "destructive" : legacy ? "brand" : t],
    // sk-button: the Square corners experiment keeps the radius of every button.
    isLink ? styles.square : cn("sk-button", styles.cornered),
    iconOnly ? cn(s.square, s.squareSvg) : isLink ? l.pad : s.pad,
    isLink ? l.text : s.text,
    legacy ? LEGACY[legacy] : VARIANT[t][h],
    // Secondary, and the Destructive / Success Tertiary that fall back to it.
    !legacy && (h === "secondary" || (h === "tertiary" && t !== "brand")) && OUTLINE_HOVER[t],
    loading && styles.loading,
    className,
  );
}

/** The icon size that goes with `buttonClassName` for the same props. */
export function buttonIconSize({
  tone,
  hierarchy,
  variant,
  size = "md",
  iconOnly = false,
}: Pick<ButtonStyleProps, "tone" | "hierarchy" | "variant" | "size" | "iconOnly"> = {}): number {
  const { isLink } = resolveButton({ tone, hierarchy, variant });
  return iconOnly ? SIZE[size].squareIcon : isLink ? LINK_SIZE[size].icon : SIZE[size].icon;
}

