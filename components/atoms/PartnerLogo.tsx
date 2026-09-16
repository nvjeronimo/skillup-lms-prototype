import * as React from "react";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/types";

export interface PartnerLogoProps {
  partner: Partner;
  /** Rendered height in px (DS Course Header row: 24). */
  height?: number;
  className?: string;
}

/**
 * One partner in the Sidebar Course Header's `Partner logos` row. Renders the
 * partner's logo asset at the row height; SkillUp uses the theme-aware wordmark.
 * A partner without an asset falls back to its name in Caption/Medium, so the
 * row never goes empty while partner artwork is still being collected.
 */
export function PartnerLogo({ partner, height = 24, className }: PartnerLogoProps) {
  const style = { height };
  if (partner.logo) {
    return (
      <span className={cn("inline-block shrink-0", className)} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={partner.logo}
          alt={partner.name}
          className={cn("block h-full w-auto", partner.logoDark && "sk-logo-light")}
        />
        {partner.logoDark ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.logoDark} alt="" aria-hidden className="sk-logo-dark h-full w-auto" />
        ) : null}
      </span>
    );
  }
  if (partner.name === "SkillUp") {
    return <SkillUpLogo className={cn("shrink-0", className)} style={style} />;
  }
  return (
    <span className={cn("sk-text-xs-medium shrink-0 text-sk-text-primary", className)}>
      {partner.name}
    </span>
  );
}
