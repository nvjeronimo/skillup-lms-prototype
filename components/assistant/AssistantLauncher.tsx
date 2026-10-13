"use client";

import * as React from "react";
import { Sparkles, X } from "lucide-react";
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

/** The round button that opens the assistant: bottom right of every platform page and of the player. */
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
          "inline-flex h-14 w-14 items-center justify-center rounded-full bg-sko-bg-primary text-sko-text-on-primary shadow-lg transition-colors",
          "hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover",
          className,
        )}
      >
        <Icon icon={open ? X : Sparkles} size={24} />
      </button>
    );
  },
);
