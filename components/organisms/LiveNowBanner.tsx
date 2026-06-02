import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export interface LiveNowBannerProps {
  title: string;
  onJoin?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/** Banner that surfaces a "Live session starting" CTA across the LMS chrome. */
export function LiveNowBanner({ title, onJoin, onDismiss, className }: LiveNowBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 bg-lms-bg-error-primary px-4 py-2.5 md:px-6",
        className,
      )}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-lms-text-error-primary" aria-hidden />
        <span className="lms-text-sm-semibold text-lms-text-error-primary">Live now</span>
        <span className="lms-text-sm-regular text-lms-text-primary">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" onClick={onJoin}>
          Join
        </Button>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="lms-text-sm-medium text-lms-text-secondary"
          >
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );
}
