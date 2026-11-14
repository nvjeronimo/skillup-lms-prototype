import * as React from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import styles from "./Button.module.css";

/** DS Button `Type`, named as in the development team's Batch 1 Button. */
export type ButtonType = "brand" | "destructive" | "success" | "neutral";
/** DS Button `Hierarchy`. */
export type ButtonHierarchy = "primary" | "secondary" | "tertiary";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** DS `Type`. Defaults to `brand`. */
  type?: ButtonType;
  /** DS `Hierarchy`. Defaults to `primary`. */
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  iconLeading?: LucideIcon;
  iconTrailing?: LucideIcon;
  /** The HTML button type (`type` is the DS Type, as in Batch 1). Defaults to `button`. */
  htmlType?: "button" | "submit" | "reset";
  /** DS State=Loading: a spinner in the leading slot; the label stays; clicks are ignored. */
  loading?: boolean;
  fullWidth?: boolean;
}

/** 20 px icons at every size (DS Button 1.4). */
const ICON_SIZE = 20;

type StyleProps = Pick<ButtonProps, "type" | "hierarchy" | "size" | "fullWidth" | "loading" | "className">;

/** The Button's classes, for anything that must look like it without being a <button> (ButtonLink). */
export function buttonClassName({
  type = "brand",
  hierarchy = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className,
}: StyleProps = {}): string {
  const outline = type === "neutral" || hierarchy === "secondary" || (hierarchy === "tertiary" && type !== "brand");
  return [
    styles.button,
    styles[type],
    styles[hierarchy],
    styles[size],
    outline && styles.outline,
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    // sk-button: the Square corners experiment and the card press rules read it (globals.css).
    "sk-button",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** The label's type style: body-medium/Semibold at sm and md, body-large/Semibold at lg and xl. */
export const buttonLabelClassName = (size: ButtonSize = "md") =>
  `${styles.label} ${size === "lg" || size === "xl" ? "sk-text-body-large-semibold" : "sk-text-body-medium-semibold"}`;

/**
 * DS Button 1.4 (v1/Base Components/Buttons/Button): the development team's Batch 1 props,
 * the DS look, in CSS Modules. A width that must change by breakpoint comes from the caller's
 * own class; `fullWidth` fills the parent at every width.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    type = "brand",
    hierarchy = "primary",
    size = "md",
    iconLeading,
    iconTrailing,
    htmlType = "button",
    loading = false,
    fullWidth = false,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const classes = buttonClassName({ type, hierarchy, size, fullWidth, loading, className });

  return (
    <button
      ref={ref}
      type={htmlType}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={classes}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {loading ? (
        <Icon icon={Loader2} size={ICON_SIZE} className={`${styles.icon} ${styles.spin}`} aria-hidden="true" />
      ) : iconLeading ? (
        <Icon icon={iconLeading} size={ICON_SIZE} className={styles.icon} />
      ) : null}
      {children !== undefined && children !== null && children !== "" ? (
        <span className={buttonLabelClassName(size)}>
          {children}
        </span>
      ) : null}
      {iconTrailing ? <Icon icon={iconTrailing} size={ICON_SIZE} className={styles.icon} /> : null}
    </button>
  );
});
