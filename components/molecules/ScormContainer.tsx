"use client";

import * as React from "react";
import { ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { cn } from "@/lib/utils";

/** loading → running in the page; `window` while it runs in its own window; `error` when it fails. */
export type ScormState = "loading" | "running" | "window" | "error";

export interface ScormContainerProps {
  title: string;
  state?: ScormState;
  /** The package itself, as the platform's iframe would show it (state `running`). */
  children?: React.ReactNode;
  /** When the learner last opened the package window ("today at 10:42"), state `window`. */
  openedAt?: string;
  /** The package's duration, for the new-window card ("about 20 min"). */
  durationLabel?: string;
  onRetry?: () => void;
  onSkip?: () => void;
  /** The SCORM XBlock's "Launch unit in new window". */
  onLaunchWindow?: () => void;
  /** Back from the window: the package plays in the page again. */
  onPlayInPage?: () => void;
  className?: string;
}

/**
 * The SCORM package's frame, as the Open edX SCORM XBlock (openedx-scorm-xblock) renders it and as
 * the Figma Activity screens draw it (ICP page 7428:1069, Row A in the page, Row B new window, A7
 * error; Nelson's SKO match review, 28 Oct 2026): the package plays in the page straight away,
 * with no launch card, no tabs and no chips. Above the frame, right-aligned, the two controls the
 * XBlock offers: "Launch unit in new window" and Fullscreen. The package itself renders in an
 * iframe served by the platform, so all we own is the chrome around it, and the error state: today
 * a failed package returns a bare HTTP 500 with no explanation, which reads as a broken course
 * rather than a broken asset.
 */
export function ScormContainer({
  title,
  state = "loading",
  children,
  openedAt,
  durationLabel,
  onRetry,
  onSkip,
  onLaunchWindow,
  onPlayInPage,
  className,
}: ScormContainerProps) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = React.useState(false);
  React.useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frameRef.current?.requestFullscreen?.();
  };
  const inPage = state === "loading" || state === "running";

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      {state !== "error" ? (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {inPage ? (
            <>
              <Button variant="secondary" size="sm" rightIcon={ExternalLink} onClick={onLaunchWindow}>
                Launch unit in new window
              </Button>
              <Button variant="secondary" size="sm" leftIcon={Maximize2} onClick={toggleFullscreen}>
                Fullscreen
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={onPlayInPage}>
              Play it in this page
            </Button>
          )}
        </div>
      ) : null}

      {/* DS LMS / Activity · SCORM Frame (20328:3488): r12, shadow-card. In the page it is the
          package (16:9, at most 52vh tall, scrolling inside); the loading, window and error states
          centre their text, the error in its own colours. */}
      <div
        ref={frameRef}
        className={cn(
          "flex w-full flex-col rounded-card border shadow-sk-card",
          fullscreen ? "h-full overflow-y-auto bg-sko-bg-page" : state === "window" ? "" : "aspect-video max-h-[52vh] overflow-y-auto",
          state === "error"
            ? "items-center justify-center gap-2 border-sko-border-error bg-sko-bg-error-soft px-10 text-center"
            : state === "running"
              ? "border-sko-border-subtle bg-sko-bg-page"
              : "items-center justify-center gap-2 border-sko-border-subtle bg-sko-bg-subtle px-10 py-8 text-center",
        )}
        role="group"
        aria-label={title}
        aria-busy={state === "loading" || undefined}
      >
        {state === "loading" ? (
          <>
            <span className="sk-text-body-large-semibold text-sko-text-muted">Loading activity…</span>
            <span className="sk-text-body-medium-regular text-sko-text-muted">
              Interactive packages can take a few seconds to start.
            </span>
          </>
        ) : state === "error" ? (
          <>
            <span className="sk-text-body-large-semibold text-sko-text-error">
              This activity couldn&rsquo;t load
            </span>
            <span className="sk-text-body-medium-regular max-w-md text-sko-text-error">
              Our activity server didn&rsquo;t respond. Your progress elsewhere is safe.
            </span>
            <div className="flex flex-wrap justify-center gap-2 pt-2 max-md:w-full max-md:[&>*]:flex-1">
              <Button variant="primary" size="md" onClick={onRetry}>
                Try again
              </Button>
              <Button variant="secondary" size="md" onClick={onSkip}>
                Skip for now
              </Button>
            </div>
          </>
        ) : state === "window" ? (
          // Row B (B2): the package is open in its own window; this page waits for its result.
          <>
            <span className="sk-text-body-large-semibold text-sko-text-default">{title}</span>
            <span className="sk-text-body-medium-regular text-sko-text-muted">
              Opens in a new window{durationLabel ? ` · about ${durationLabel}` : ""}
            </span>
            <div className="pt-2">
              <Button variant="secondary" size="md" rightIcon={ExternalLink} onClick={onLaunchWindow}>
                Open the activity window
              </Button>
            </div>
            {openedAt ? (
              <span className="sk-text-body-small-regular text-sko-text-muted">
                Opened in a new window {openedAt}
              </span>
            ) : null}
          </>
        ) : (
          children
        )}
      </div>

      {state === "window" ? (
        <InlineAlert
          tone="info"
          title="The activity is open in another window"
          description="When you finish there, your result appears on this page."
        />
      ) : null}

      {/* Only where it is true: on a small screen (it read as noise on desktop). */}
      {state !== "error" ? (
        <div className="md:hidden">
          <InlineAlert
            tone="info"
            title="Best viewed on a larger screen"
            description="Interactive activities work best on a larger screen and may not be fully supported in the mobile app. Open this one on desktop or the web."
          />
        </div>
      ) : null}
    </section>
  );
}
