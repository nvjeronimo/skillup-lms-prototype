"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { BUTTON_DONE_MS, showsDoneCheck } from "@/lib/motion/feedback";
import { buttonClassName, buttonIconSize, type ButtonProps } from "./buttonStyles";

export { buttonClassName, buttonIconSize } from "./buttonStyles";
export type {
  ButtonHierarchy,
  ButtonProps,
  ButtonSize,
  ButtonStyleProps,
  ButtonTone,
  ButtonVariant,
} from "./buttonStyles";

/**
 * DS Button: Button (Type × Hierarchy), Link Button (`hierarchy="link" | "link-subtle"`)
 * and Icon Button (`iconOnly`). The deprecated `variant` prop maps onto tone + hierarchy.
 * Destructive + utility stay UUI gray-neutral by design (`variant="destructive" | "utility"`).
 * For navigation use atoms/ButtonLink: the same look on a real link.
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
    done,
    className,
    children,
    disabled,
    onClick,
    style,
    ...rest
  },
  ref,
) {
  const iconSize = buttonIconSize({ tone, hierarchy, variant, size, iconOnly });
  const hasLabel = !iconOnly && children !== undefined && children !== null && children !== false && children !== "";

  // Loading keeps the width the button had when it started; a Done check may follow.
  const innerRef = React.useRef<HTMLButtonElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  const [minWidth, setMinWidth] = React.useState<number | undefined>(undefined);
  const [showCheck, setShowCheck] = React.useState(false);
  const wasLoading = React.useRef(loading);
  React.useLayoutEffect(() => {
    const prev = wasLoading.current;
    wasLoading.current = loading;
    if (loading && !prev) {
      setShowCheck(false);
      setMinWidth(innerRef.current?.offsetWidth);
      return;
    }
    if (!loading && prev) {
      if (showsDoneCheck(prev, loading, done)) setShowCheck(true);
      else setMinWidth(undefined);
    }
  }, [loading, done]);
  React.useEffect(() => {
    if (!showCheck) return;
    const t = window.setTimeout(() => {
      setShowCheck(false);
      setMinWidth(undefined);
    }, BUTTON_DONE_MS);
    return () => window.clearTimeout(t);
  }, [showCheck]);

  const spinner = loading ? (
    <Icon icon={Loader2} size={iconSize} className="animate-spin" aria-hidden="true" />
  ) : showCheck ? (
    // Lucide's Check, drawn: pathLength 1 lets sk-draw-check-immediate dash the whole stroke.
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M20 6 9 17l-5-5" pathLength={1} className="sk-draw-check-immediate" />
    </svg>
  ) : null;

  return (
    <button
      ref={setRefs}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={buttonClassName({ tone, hierarchy, variant, size, iconOnly, loading, className })}
      style={minWidth !== undefined ? { ...style, minWidth } : style}
      {...rest}
      onClick={loading ? (e) => e.preventDefault() : onClick}
    >
      {iconOnly && spinner ? (
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
