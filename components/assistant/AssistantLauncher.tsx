"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface AssistantLauncherProps {
  open: boolean;
  onToggle: () => void;
  /** The id of the window it opens. */
  controls: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The button that opens the assistant: bottom left of every platform page and of the player.
 * Closed, it is the assistant mark: the SkillUp ball and paper plane with AI sparkles in place
 * of the trail lines (Nelson, 13 Oct 2026; DS `LMS/Platform/Assistant/Assistant-Launcher`).
 * Like the logo, the mark keeps its own colours and swaps its ink to white on a dark page
 * (two assets toggled by [data-theme], see SkillUpLogo). Open, it is a round close button.
 */
export const AssistantLauncher = React.forwardRef<HTMLButtonElement, AssistantLauncherProps>(
  function AssistantLauncher({ open, onToggle, controls, className, style }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        aria-label={open ? "Close the assistant" : "Ask the assistant"}
        aria-expanded={open}
        aria-controls={controls}
        style={style}
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-full transition-transform",
          open
            ? "bg-sko-bg-primary text-sko-text-on-primary shadow-lg hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover"
            : "drop-shadow-lg hover:scale-105",
          className,
        )}
      >
        {open ? (
          <Icon icon={X} size={24} />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assistant-mark.svg" alt="" aria-hidden className="sk-logo-light block h-14 w-14" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assistant-mark-dark.svg" alt="" aria-hidden className="sk-logo-dark h-14 w-14" />
          </>
        )}
      </button>
    );
  },
);
