import * as React from "react";
import Link from "@/lib/router";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./CtaLink.module.css";

/**
 * A navigation CTA with Button md styling (44px). The Button atom renders a <button>, and a
 * link must stay a link, so this mirrors its Brand Primary / Brand Secondary / Success Primary
 * classes on a Next <Link>.
 */
type CtaStyle = "primary" | "secondary" | "success";

const STYLE: Record<CtaStyle, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  success: styles.success,
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
        "sk-text-body-medium-semibold",
        styles.cta,
        STYLE[variant],
        className,
      )}
    >
      <span className={styles.label}>{children}</span>
      {icon ? <Icon icon={icon} size={20} aria-hidden="true" /> : null}
    </Link>
  );
}
