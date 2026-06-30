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
  className?: string;
}

const SIZE: Record<AvatarSize, { box: string; text: string; dot: string }> = {
  xs: { box: "h-6 w-6", text: "sk-text-2xs-semibold", dot: "h-1.5 w-1.5" },
  sm: { box: "h-8 w-8", text: "sk-text-xs-semibold", dot: "h-2 w-2" },
  md: { box: "h-10 w-10", text: "sk-text-sm-semibold", dot: "h-2.5 w-2.5" },
  lg: { box: "h-12 w-12", text: "sk-text-md-semibold", dot: "h-3 w-3" },
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
export function Avatar({ name, src, size = "md", status = "none", className }: AvatarProps) {
  const s = SIZE[size];
  // Fall back to initials if no src OR the image fails to load (e.g. 404).
  const [failed, setFailed] = React.useState(false);
  const showImg = src && !failed;
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center overflow-hidden rounded-full bg-sk-bg-brand-section text-sk-text-brand-secondary",
          s.box,
          s.text,
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
            "absolute bottom-0 right-0 rounded-full border-2 border-sk-bg-primary",
            s.dot,
            status === "online" ? "bg-sk-text-success-primary" : "bg-sk-fg-quaternary",
          )}
        />
      ) : null}
    </span>
  );
}
