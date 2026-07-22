"use client";

import * as React from "react";
import { RotateCcw, Play } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { secondsToTs } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface ResumeBannerProps {
  /** Stored playback position in seconds. */
  seconds: number;
  onResume: () => void;
  onStartOver: () => void;
  className?: string;
}

/**
 * Offers to pick playback back up where the learner left off. The platform
 * stores the position already — the gap was that nothing surfaced it, so a
 * returning learner always restarted from zero.
 */
export function ResumeBanner({ seconds, onResume, onStartOver, className }: ResumeBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sk-border-brand bg-sk-bg-brand-section px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon icon={Play} size={16} className="text-sk-text-brand-secondary" />
        <div className="flex flex-col">
          <span className="sk-text-sm-semibold text-sk-text-brand-secondary">
            Pick up where you left off
          </span>
          <span className="sk-text-xs-regular text-sk-text-brand-secondary">
            You stopped at {secondsToTs(seconds)}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" size="sm" onClick={onResume}>
          Resume from {secondsToTs(seconds)}
        </Button>
        <Button variant="secondary" size="sm" leftIcon={RotateCcw} onClick={onStartOver}>
          Start over
        </Button>
      </div>
    </div>
  );
}
