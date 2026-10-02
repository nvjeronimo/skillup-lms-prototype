import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { buttonClassName, buttonIconSize, type ButtonHierarchy, type ButtonSize, type ButtonTone } from "./Button";

/* What a <button> gets from the browser or from globals.css and an <a> does not: the centred
   label, and the 44px minimum of the "larger targets" setting (on by default on mobile),
   which globals.css gives to buttons only. */
const LIKE_A_BUTTON = "text-center [[data-large-targets]_&]:min-h-[44px] [[data-large-targets]_&]:min-w-[44px]";

export interface ButtonLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "className" | "children"> {
  /** DS `Type`. Defaults to `brand`. */
  tone?: ButtonTone;
  /** DS `Hierarchy`. Defaults to `primary`. */
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

/**
 * DS Button V2 on a link: the look of atoms/Button (same classes, same markup inside) on a
 * Next <Link>, for every action that goes to a page. A link stays a link: it can be opened
 * in a new tab, it is announced as a link and Next prefetches it. Actions that stay on the
 * page keep atoms/Button. A link has no Disabled or Loading state and no icon-only form.
 */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { tone, hierarchy, size = "md", leftIcon, rightIcon, className, children, ...rest },
  ref,
) {
  const iconSize = buttonIconSize({ tone, hierarchy, size });
  const hasLabel = children !== undefined && children !== null && children !== false && children !== "";
  return (
    <Link
      ref={ref}
      className={buttonClassName({ tone, hierarchy, size, className: cn(LIKE_A_BUTTON, className) })}
      {...rest}
    >
      {leftIcon ? <Icon icon={leftIcon} size={iconSize} /> : null}
      {hasLabel ? <span className="px-0.5">{children}</span> : null}
      {rightIcon ? <Icon icon={rightIcon} size={iconSize} /> : null}
    </Link>
  );
});
