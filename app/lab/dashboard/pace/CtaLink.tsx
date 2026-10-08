import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * A navigation CTA with Button V2 md styling (44px). The Button atom renders a <button>, and a
 * link must stay a link, so this mirrors its Brand Primary / Brand Secondary / Success Primary
 * classes on a Next <Link>.
 */
type CtaStyle = "primary" | "secondary" | "success";

const STYLE: Record<CtaStyle, string> = {
  primary:
    "bg-sko-bg-primary text-sko-text-on-primary hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover [--btn-ring:var(--color-border-primary)]",
  secondary:
    "bg-sko-bg-page text-sko-text-primary ring-1 ring-inset ring-sko-border-primary hover:bg-sko-bg-faint forced-colors:border forced-colors:border-solid forced-colors:border-sko-border-primary [--btn-ring:var(--color-border-primary)]",
  success:
    "bg-sko-bg-success text-sko-text-on-success hover:bg-sko-bg-success-soft hover:text-sko-text-success [--btn-ring:var(--color-border-success)]",
};

export interface CtaLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: CtaStyle;
  icon?: LucideIcon;
  /** Accessible name when the visible label needs context (e.g. "Resume" + course title). */
  "aria-label"?: string;
  className?: string;
}

export function CtaLink({ href, children, variant = "primary", icon, className, ...rest }: CtaLinkProps) {
  return (
    <Link
      href={href}
      aria-label={rest["aria-label"]}
      className={cn(
        "sk-text-body-medium-semibold inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md px-3 transition-colors duration-200",
        "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-border-focus-gap),0_0_0_4px_var(--btn-ring)]",
        STYLE[variant],
        className,
      )}
    >
      <span className="px-0.5">{children}</span>
      {icon ? <Icon icon={icon} size={20} aria-hidden="true" /> : null}
    </Link>
  );
}
