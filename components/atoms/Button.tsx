import * as React from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** DS Button V2 `Type` (Button_def / Link Button_def / Icon Button_def). */
export type ButtonTone = "brand" | "destructive" | "success";
/**
 * DS Button V2 `Hierarchy`. Primary/Secondary/Tertiary are Button_def; `link` and
 * `link-subtle` are Link Button_def Hierarchy=Primary and Hierarchy=Secondary (the grey link).
 */
export type ButtonHierarchy = "primary" | "secondary" | "tertiary" | "link" | "link-subtle";
/**
 * @deprecated Use `tone` + `hierarchy`. Kept so existing call sites keep working:
 * primary/secondary/tertiary → Brand, destructive → Destructive/Secondary.
 * `neutral` and `utility` have no Button V2 equivalent yet and keep their own styles.
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
  /** Render an icon-only square button (DS Icon Button_def): 20px icon at sm/md, 24px at lg/xl. */
  iconOnly?: boolean;
  /**
   * DS State=Loading: a spinner takes the leading-icon slot and the label stays visible.
   * The button keeps its tone colours (no native `disabled`), is marked aria-busy and
   * aria-disabled, and ignores clicks.
   */
  loading?: boolean;
}

/* Colour per Type × Hierarchy, as bound in Button_def 21851:7608 and Link Button_def 21851:7679.
   Strokes are INSIDE in the DS, so they are drawn as inset rings and add no width. */
const PRIMARY_DISABLED =
  "disabled:bg-sko-bg-muted disabled:text-sko-text-disabled disabled:ring-1 disabled:ring-inset disabled:ring-sko-border-subtle";
const OUTLINE_DISABLED = "disabled:ring-sko-border-subtle disabled:text-sko-text-disabled";
const GHOST_DISABLED = "disabled:text-sko-text-disabled";
/* Brand icons take icon/primary while enabled; disabled icons inherit the label colour. */
const BRAND_ICON = "[&:enabled_svg]:text-sko-icon-primary";
const LINK = "bg-transparent hover:bg-sko-bg-faint disabled:text-sko-text-disabled";

const VARIANT: Record<ButtonTone, Record<ButtonHierarchy, string>> = {
  brand: {
    // Teal fill → yellow hover, dark text on hover (handoff brand-aware rule).
    primary: cn(
      "bg-sko-bg-primary text-sko-text-on-primary hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover",
      PRIMARY_DISABLED,
    ),
    secondary: cn(
      "bg-sko-bg-page text-sko-text-primary ring-1 ring-inset ring-sko-border-primary hover:bg-sko-bg-faint",
      BRAND_ICON,
      OUTLINE_DISABLED,
    ),
    tertiary: cn("bg-sko-bg-page text-sko-text-primary hover:bg-sko-bg-faint", BRAND_ICON, GHOST_DISABLED),
    link: cn(LINK, "text-sko-text-primary", BRAND_ICON),
    "link-subtle": cn(LINK, "text-sko-text-subtle"),
  },
  destructive: {
    // Hover pending DS-03: the V2 hover binds border/error-soft as a fill; bg/error-soft is its role-correct match.
    primary: cn(
      "bg-sko-bg-error text-sko-text-on-error hover:bg-sko-bg-error-soft hover:text-sko-text-error",
      PRIMARY_DISABLED,
    ),
    secondary: cn(
      "bg-sko-bg-page text-sko-text-error ring-1 ring-inset ring-sko-border-error hover:bg-sko-bg-faint",
      OUTLINE_DISABLED,
    ),
    // No Destructive/Tertiary in the DS: falls back to Destructive/Secondary.
    tertiary: cn(
      "bg-sko-bg-page text-sko-text-error ring-1 ring-inset ring-sko-border-error hover:bg-sko-bg-faint",
      OUTLINE_DISABLED,
    ),
    link: cn(LINK, "text-sko-text-error"),
    // The grey link exists only as Brand/Secondary.
    "link-subtle": cn(LINK, "text-sko-text-subtle"),
  },
  success: {
    // Hover pending DS-03 (the V2 Success/Primary Hover is defective): bg/success-soft + text/success.
    primary: cn(
      "bg-sko-bg-success text-sko-text-on-success [&:enabled_svg]:text-sko-icon-on-success",
      "hover:bg-sko-bg-success-soft hover:text-sko-text-success [&:enabled:hover_svg]:text-sko-icon-success",
      PRIMARY_DISABLED,
    ),
    secondary: cn(
      "bg-sko-bg-page text-sko-text-success ring-1 ring-inset ring-sko-border-success hover:bg-sko-bg-faint",
      OUTLINE_DISABLED,
    ),
    // No Success/Tertiary in the DS: falls back to Success/Secondary.
    tertiary: cn(
      "bg-sko-bg-page text-sko-text-success ring-1 ring-inset ring-sko-border-success hover:bg-sko-bg-faint",
      OUTLINE_DISABLED,
    ),
    link: cn(LINK, "text-sko-text-success"),
    "link-subtle": cn(LINK, "text-sko-text-subtle"),
  },
};

/* Styles with no Button V2 equivalent yet (the ICP cases V2 misses). No DS disabled state
   exists for them, so they keep the 50% opacity. */
type LegacyStyle = "neutral" | "utility";
const LEGACY: Record<LegacyStyle, string> = {
  // Neutral grey outline, e.g. the footer "Previous".
  neutral:
    "bg-transparent text-sko-text-subtle ring-1 ring-inset ring-sko-border-default hover:bg-sko-bg-subtle disabled:opacity-50",
  utility: "bg-sko-bg-subtle text-sko-text-muted hover:bg-sko-bg-muted disabled:opacity-50",
};

const VARIANT_ALIAS: Record<Exclude<ButtonVariant, LegacyStyle>, { tone: ButtonTone; hierarchy: ButtonHierarchy }> = {
  primary: { tone: "brand", hierarchy: "primary" },
  secondary: { tone: "brand", hierarchy: "secondary" },
  tertiary: { tone: "brand", hierarchy: "tertiary" },
  destructive: { tone: "destructive", hierarchy: "secondary" },
};

/* DS State=Focused: a 2px border/focus-gap, then a 2px ring in the tone colour. */
const FOCUS_RING: Record<ButtonTone, string> = {
  brand: "[--btn-ring:var(--color-border-primary)]",
  destructive: "[--btn-ring:var(--color-border-error)]",
  success: "[--btn-ring:var(--color-border-success)]",
};

/* ._Button_Structure 21851:7567 and ._Icon Button_Structure 21851:7599.
   The label sits in a 2px "Text padding" frame, rendered as the px-0.5 span below. */
const SIZE: Record<
  ButtonSize,
  { pad: string; text: string; icon: number; square: string; squareIcon: number; squareSvg: string }
> = {
  // 36 tall, 8/12 padding, 4 gap, body-medium/Semibold, 20 icon.
  sm: { pad: "h-9 px-3 gap-1", text: "sk-text-sm-semibold", icon: 20, square: "h-9 w-9", squareIcon: 20, squareSvg: "[&_svg]:size-5" },
  // 44 tall, 12/12 padding, 4 gap, body-medium/Semibold, 20 icon.
  md: { pad: "h-11 px-3 gap-1", text: "sk-text-sm-semibold", icon: 20, square: "h-11 w-11", squareIcon: 20, squareSvg: "[&_svg]:size-5" },
  // 48 tall, 12/16 padding, 6 gap, body-large/Semibold, 20 icon (24 icon-only).
  lg: { pad: "h-12 px-4 gap-1.5", text: "sk-text-md-semibold", icon: 20, square: "h-12 w-12", squareIcon: 24, squareSvg: "[&_svg]:size-6" },
  // 56 tall, 16/20 padding, 6 gap, body-large/Semibold, 20 icon (24 icon-only).
  xl: { pad: "h-14 px-5 gap-1.5", text: "sk-text-md-semibold", icon: 20, square: "h-14 w-14", squareIcon: 24, squareSvg: "[&_svg]:size-6" },
};

/* ._Link Button_Structure 21851:7588 has md and lg only: sm maps to md, xl to lg.
   4/2 padding, 4 gap, radius 0, no underline. */
const LINK_SIZE: Record<ButtonSize, { pad: string; text: string; icon: number }> = {
  sm: { pad: "h-7 px-0.5 py-1 gap-1", text: "sk-text-sm-semibold", icon: 16 },
  md: { pad: "h-7 px-0.5 py-1 gap-1", text: "sk-text-sm-semibold", icon: 16 },
  lg: { pad: "h-8 px-0.5 py-1 gap-1", text: "sk-text-md-semibold", icon: 20 },
  xl: { pad: "h-8 px-0.5 py-1 gap-1", text: "sk-text-md-semibold", icon: 20 },
};

/**
 * DS Button V2: Button_def (Type × Hierarchy), Link Button_def (`hierarchy="link" | "link-subtle"`)
 * and Icon Button_def (`iconOnly`). The deprecated `variant` prop maps onto tone + hierarchy.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    tone,
    hierarchy,
    variant,
    size = "md",
    leftIcon,
    rightIcon,
    iconOnly = false,
    loading = false,
    className,
    children,
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  const legacy: LegacyStyle | null =
    hierarchy === undefined && tone === undefined && (variant === "neutral" || variant === "utility") ? variant : null;
  const alias = variant && variant !== "neutral" && variant !== "utility" ? VARIANT_ALIAS[variant] : undefined;
  const t: ButtonTone = tone ?? alias?.tone ?? "brand";
  const h: ButtonHierarchy = hierarchy ?? alias?.hierarchy ?? "primary";
  const isLink = legacy === null && (h === "link" || h === "link-subtle");

  const s = SIZE[size];
  const l = LINK_SIZE[size];
  const iconSize = iconOnly ? s.squareIcon : isLink ? l.icon : s.icon;
  const hasLabel = !iconOnly && children !== undefined && children !== null && children !== false && children !== "";
  const spinner = loading ? (
    <Icon icon={Loader2} size={iconSize} className="animate-spin" aria-hidden="true" />
  ) : null;

  return (
    <button
      ref={ref}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-200 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-border-focus-gap),0_0_0_4px_var(--btn-ring)]",
        FOCUS_RING[legacy ? "brand" : t],
        isLink ? "rounded-none" : "rounded-md",
        iconOnly ? cn(s.square, s.squareSvg) : isLink ? l.pad : s.pad,
        isLink ? l.text : s.text,
        legacy ? LEGACY[legacy] : VARIANT[t][h],
        loading && "pointer-events-none",
        className,
      )}
      {...rest}
      onClick={loading ? (e) => e.preventDefault() : onClick}
    >
      {iconOnly && loading ? (
        spinner
      ) : (
        <>
          {spinner ?? (leftIcon ? <Icon icon={leftIcon} size={iconSize} /> : null)}
          {hasLabel ? <span className="px-0.5">{children}</span> : null}
          {iconOnly ? children : null}
          {rightIcon ? <Icon icon={rightIcon} size={iconSize} /> : null}
        </>
      )}
    </button>
  );
});
