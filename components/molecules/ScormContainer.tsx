"use client";

import * as React from "react";
import { Maximize2 } from "lucide-react";
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

      {/* DS LMS / Activity · SCORM Frame (20328:3488): centred column, p 0/40,
          gap 8, r12, shadow-card, no icon in any state. Title body-large/Bold
          (semibold until .sk-text-md-bold exists, CT-22), description
          body-medium/Regular, both in the state's colour. */}
      <div
        className={cn(
          "flex aspect-video max-h-[52vh] w-full flex-col items-center justify-center gap-2 rounded-xl border px-10 text-center shadow-sk-card",
          state === "error"
            ? "border-sko-border-error bg-sko-bg-error-soft"
            : "border-sko-border-subtle bg-sko-bg-subtle",
        )}
        role="group"
        aria-label={title}
        aria-busy={state === "loading" || undefined}
      >
        {state === "loading" ? (
          <>
            <span className="sk-text-md-semibold text-sko-text-muted">Loading activity…</span>
            <span className="sk-text-sm-regular text-sko-text-muted">
              Interactive packages can take a few seconds to start.
            </span>
          </>
        ) : state === "error" ? (
          <>
            <span className="sk-text-md-semibold text-sko-text-error">
              This activity couldn&rsquo;t load
            </span>
            <span className="sk-text-sm-regular max-w-md text-sko-text-error">
              Our activity server didn&rsquo;t respond. Your progress elsewhere is safe. This
              activity is ungraded.
            </span>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Button variant="primary" size="md" onClick={onRetry}>
                Try again
              </Button>
              <Button variant="secondary" size="md" onClick={onSkip}>
                Skip for now
              </Button>
            </div>
          </>
        ) : state === "ready" ? (
          <>
            <span className="sk-text-md-semibold text-sko-text-muted">
              Activity running. Interact in the frame above
            </span>
            <span className="sk-text-sm-regular text-sko-text-muted">
              Your progress and score are saved automatically and resume next time.
            </span>
          </>
        ) : (
          <>
            <span className="sk-text-md-semibold text-sko-text-default">{title}</span>
            {packageLabel ? (
              <span className="sk-text-sm-regular text-sko-text-default">
                {packageLabel}
                {packageSizeLabel ? ` · ${packageSizeLabel}` : ""}
              </span>
            ) : null}
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="primary" size="md" onClick={onLaunch}>
                Start activity
              </Button>
            </div>
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
