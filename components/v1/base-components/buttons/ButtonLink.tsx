import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Link } from "@/lib/router";
import { buttonClassName, buttonLabelClassName, type ButtonHierarchy, type ButtonSize, type ButtonType } from "./Button";

export interface ButtonLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "type"> {
  href: string;
  type?: ButtonType;
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  iconLeading?: LucideIcon;
  iconTrailing?: LucideIcon;
  fullWidth?: boolean;
}

/** A link with the Button's look, for navigation (a <button> must not navigate). */
export function ButtonLink({
  href,
  type,
  hierarchy,
  size = "md",
  iconLeading,
  iconTrailing,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClassName({ type, hierarchy, size, fullWidth, className })} {...rest}>
      {iconLeading ? <Icon icon={iconLeading} size={20} /> : null}
      <span className={buttonLabelClassName(size)}>{children}</span>
      {iconTrailing ? <Icon icon={iconTrailing} size={20} /> : null}
    </Link>
  );
}
