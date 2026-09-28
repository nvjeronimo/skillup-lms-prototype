"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
  name: string;
  /** Optional image; falls back to initials. */
  src?: string;
  size?: AvatarSize;
  /** Online status dot. */
  status?: "online" | "offline" | "none";
  /**
   * Corner shape. "circle" (default) is the only shape in the DS Avatar
   * (radius 9999), including the topbar profile avatar. "square" (rounded-lg)
   * is kept for backward compatibility only; it has no DS match.
   */
  shape?: "circle" | "square";
  className?: string;
}

// DS Avatar (19:1012), per Size variant:
// - text: initials style, body-small / body-medium / body-large / title-medium, all Semibold.
// - border: the Text=True stroke width (border/subtle, drawn inside): 0.5 / 0.75 / 1 / 1 px.
// - dot: the _Avatar online indicator, 6 / 8 / 10 / 12 px.
const SIZE: Record<AvatarSize, { box: string; text: string; border: string; dot: string }> = {
  xs: { box: "h-6 w-6", text: "sk-text-xs-semibold", border: "border-[0.5px]", dot: "h-1.5 w-1.5" },
  sm: { box: "h-8 w-8", text: "sk-text-sm-semibold", border: "border-[0.75px]", dot: "h-2 w-2" },
  md: { box: "h-10 w-10", text: "sk-text-md-semibold", border: "border", dot: "h-2.5 w-2.5" },
  lg: { box: "h-12 w-12", text: "sk-text-lg-semibold", border: "border", dot: "h-3 w-3" },
};

const DOT_COLOR: Record<"online" | "offline", string> = {
  // token-lint-disable-next-line DS _Avatar online indicator binds icon/success-strong as fill
  online: "bg-sko-icon-success-strong",
  // token-lint-disable-next-line DS Avatar has no Offline status (only Online, Company, Verified); grey dot kept at its previous value until the DS defines one
  offline: "bg-sko-icon-faint",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Avatar with image or initials fallback + optional status dot. */
export function Avatar({
  name,
  src,
  size = "md",
  status = "none",
  shape = "circle",
  className,
}: AvatarProps) {
  const s = SIZE[size];
  // Fall back to initials if no src OR the image fails to load (e.g. 404).
  const [failed, setFailed] = React.useState(false);
  const showImg = src && !failed;
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center overflow-hidden text-sko-text-primary",
          shape === "square" ? "rounded-lg" : "rounded-full",
          s.box,
          s.text,
          // Initials (DS Text=True): bg/muted fill with a border/subtle stroke inside.
          showImg ? "bg-sko-bg-primary-soft" : cn("bg-sko-bg-muted border-sko-border-subtle", s.border),
        )}
      >
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          initials(name)
        )}
      </span>
      {status !== "none" ? (
        <span
          aria-label={status === "online" ? "Online" : "Offline"}
          className={cn(
            // DS _Avatar online indicator: 1.5px bg/page stroke drawn OUTSIDE the dot,
            // so a ring (outside the box) rather than a border (inside it).
            "absolute bottom-0 right-0 rounded-full ring-[1.5px] ring-sko-bg-page",
            s.dot,
            DOT_COLOR[status],
          )}
        />
      ) : null}
    </span>
  );
}
