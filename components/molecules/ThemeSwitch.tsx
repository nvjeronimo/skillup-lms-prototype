"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * The light / dark switch of the top bars (Nelson, 26 Oct 2026: "um mini switcher, só com os
 * icons"): a DS Button group with two icon segments, Sun and Moon, the current theme pressed. It
 * replaces the single Utility Button that showed the theme to switch to, so the state is always
 * visible. Decision 028's Button group: segments 6 inside a 10 track with 4 of padding. `sm` is the
 * desktop bars' (24 segments in a 32 track, the height of the bar's other icons; Nelson, 26 Oct
 * 2026: smaller); `md` is the compact bars': 32 segments in a 40 track (Nelson, 26 Oct 2026: it was
 * 44 segments, too big on a phone). Both sizes keep 44-tall targets through an invisible band, so
 * "larger targets" no longer blows the segments up to 44. The track is bg/muted, not
 * bg/track: Harbor and Fluent restyle every bg/track row as bare filters, and this one must read as
 * one group in every skin (Nelson, 26 Oct 2026).
 */
export function ThemeSwitch({
  value,
  onChange,
  size = "sm",
  className,
}: {
  value: "light" | "dark";
  onChange: (theme: "light" | "dark") => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const options = [
    { theme: "light" as const, label: "Light theme", icon: Sun },
    { theme: "dark" as const, label: "Dark theme", icon: Moon },
  ];
  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn("inline-flex shrink-0 gap-0.5 rounded-track bg-sko-bg-muted p-1", className)}
    >
      {options.map((o) => {
        const on = value === o.theme;
        return (
          <button
            key={o.theme}
            type="button"
            aria-pressed={on}
            aria-label={o.label}
            title={o.label}
            data-hit-band=""
            onClick={() => onChange(o.theme)}
            className={cn(
              "inline-flex items-center justify-center rounded-control border transition-colors",
              // The visible segment stays small; an invisible band makes the target 44 tall and
              // reaches 6 past the track's outer edge (globals.css lets [data-hit-band] skip the
              // 44 × 44 minimum of "larger targets").
              "relative before:absolute before:inset-x-0 before:content-[''] first:before:-left-1.5 last:before:-right-1.5",
              size === "md" ? "size-8 before:-inset-y-1.5" : "size-6 before:-inset-y-2.5",
              on
                ? "border-sko-border-subtle bg-sko-bg-page text-sko-icon-default"
                : "border-transparent text-sko-icon-subtle hover:text-sko-icon-default",
            )}
          >
            <Icon icon={o.icon} size={size === "md" ? 16 : 14} />
          </button>
        );
      })}
    </div>
  );
}
