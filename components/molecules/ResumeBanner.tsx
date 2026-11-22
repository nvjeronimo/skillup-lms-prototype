import * as React from "react";
import { RotateCcw, Play } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { secondsToTs } from "@/lib/utils";
import { cn } from "@/lib/utils";
import styles from "./ResumeBanner.module.css";

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
      className={cn(styles.banner, className)}
    >
      <div className={styles.lead}>
        <Icon icon={Play} size={16} className={styles.icon} />
        <div className={styles.copy}>
          <span className={`sk-text-body-medium-semibold ${styles.title}`}>
            Pick up where you left off
          </span>
          <span className={`sk-text-body-small-regular ${styles.text}`}>
            You stopped at {secondsToTs(seconds)}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
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
