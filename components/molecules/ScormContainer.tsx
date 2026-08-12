"use client";

import * as React from "react";
import { Play, Maximize2, AlertTriangle, RotateCcw, Loader2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { cn } from "@/lib/utils";

export type ScormState = "idle" | "loading" | "ready" | "error";

export interface ScormContainerProps {
  title: string;
  packageLabel?: string;
  packageSizeLabel?: string;
  state?: ScormState;
  onLaunch?: () => void;
  onRetry?: () => void;
  onSkip?: () => void;
  onFullscreen?: () => void;
  className?: string;
}

/**
 * SCORM activity shell. The package itself renders in an iframe served by the
 * platform, so all we own is the chrome around it — and the error state, which
 * is the one that matters: today a failed package returns a bare HTTP 500 with
 * no explanation, which reads as a broken course rather than a broken asset.
 */
export function ScormContainer({
  title,
  packageLabel,
  packageSizeLabel,
  state = "idle",
  onLaunch,
  onRetry,
  onSkip,
  onFullscreen,
  className,
}: ScormContainerProps) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">Interactive activity</Badge>
          <Badge tone="neutral">Ungraded</Badge>
        </div>
        {state === "ready" ? (
          <Button variant="secondary" size="sm" leftIcon={Maximize2} onClick={onFullscreen}>
            Fullscreen
          </Button>
        ) : null}
      </div>

      <div
        className={cn(
          "flex aspect-video max-h-[52vh] w-full flex-col items-center justify-center gap-3 rounded-xl border px-6 text-center",
          state === "error"
            ? "border-sk-text-error-primary bg-sk-bg-error-primary"
            : "border-sk-border-secondary bg-sk-bg-secondary",
        )}
        role="group"
        aria-label={title}
      >
        {state === "loading" ? (
          <>
            <Icon icon={Loader2} size={24} className="animate-spin text-sk-text-brand-secondary" />
            <span className="sk-text-sm-medium text-sk-text-secondary">Loading activity…</span>
            <span className="sk-text-xs-regular text-sk-text-tertiary">
              Interactive packages can take a few seconds to start.
            </span>
          </>
        ) : state === "error" ? (
          <>
            <Icon icon={AlertTriangle} size={24} className="text-sk-text-error-primary" />
            <span className="sk-text-md-semibold text-sk-text-error-primary">
              This activity couldn&rsquo;t load
            </span>
            <span className="sk-text-sm-regular max-w-md text-sk-text-error-primary">
              Our activity server didn&rsquo;t respond. Your progress elsewhere is safe. This
              activity doesn&rsquo;t affect your grade.
            </span>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              <Button variant="primary" size="sm" leftIcon={RotateCcw} onClick={onRetry}>
                Try again
              </Button>
              <Button variant="secondary" size="sm" onClick={onSkip}>
                Skip for now
              </Button>
            </div>
          </>
        ) : state === "ready" ? (
          <>
            <Icon icon={Play} size={26} className="text-sk-text-brand-secondary" />
            <span className="sk-text-sm-medium text-sk-text-secondary">
              Activity running. Interact in the frame above
            </span>
            <span className="sk-text-xs-regular text-sk-text-tertiary">
              Your progress and score are saved automatically and resume next time.
            </span>
          </>
        ) : (
          <>
            <Icon icon={Play} size={26} className="text-sk-text-brand-secondary" />
            <span className="sk-text-md-semibold text-sk-text-primary">{title}</span>
            {packageLabel ? (
              <span className="sk-text-xs-regular text-sk-text-tertiary">
                {packageLabel}
                {packageSizeLabel ? ` · ${packageSizeLabel}` : ""}
              </span>
            ) : null}
            <Button variant="primary" onClick={onLaunch}>
              Start activity
            </Button>
          </>
        )}
      </div>

      {state !== "error" ? (
        <InlineAlert
          tone="info"
          title="Best viewed on a larger screen"
          description="Interactive activities work best on a larger screen and may not be fully supported in the mobile app. Open this one on desktop or the web."
        />
      ) : null}
    </section>
  );
}
