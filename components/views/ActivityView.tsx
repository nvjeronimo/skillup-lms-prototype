"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Button } from "@/components/atoms/Button";
import { ProgressRail, type RailItemState } from "@/components/molecules/ProgressRail";
import { ScormContainer, type ScormState } from "@/components/molecules/ScormContainer";
import { getActivity } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ActivityView({ topicId }: { topicId: string }) {
  const isCompleted = useLmsStore((s) => s.completedTopics.has(topicId));
  const markComplete = useLmsStore((s) => s.markComplete);

  const topic = getTopic(topicId);
  const activity = topic ? getActivity(topic) : null;
  const stepCount = activity?.steps.length ?? 0;

  // A completed topic opens with every step already ticked (shows the result).
  const [done, setDone] = React.useState<Set<number>>(() =>
    isCompleted ? new Set(Array.from({ length: stepCount }, (_, i) => i)) : new Set(),
  );

  const allDone = stepCount > 0 && done.size === stepCount;

  // Ticking the last step completes the topic (drives the sidebar check live).
  React.useEffect(() => {
    if (allDone && !isCompleted) markComplete(topicId);
  }, [allDone, isCompleted, markComplete, topicId]);

  if (!topic || !activity) return null;

  if (activity.kind === "scorm") {
    return (
      <ScormActivity
        title={topic.title}
        packageLabel={activity.packageLabel}
        packageSizeLabel={activity.packageSizeLabel}
        isCompleted={isCompleted}
        onComplete={() => markComplete(topicId)}
      />
    );
  }

  function toggle(i: number) {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  // First step still to do — the one the learner is "on".
  const currentIdx = activity.steps.findIndex((_, i) => !done.has(i));
  const railStates: RailItemState[] = activity.steps.map((_, i) =>
    done.has(i) ? "done" : i === currentIdx ? "current" : "pending",
  );

  return (
    <div className="flex flex-col gap-4 py-4">
      <ProgressRail
        states={railStates}
        currentIndex={currentIdx}
        label={
          allDone
            ? `All ${stepCount} steps complete`
            : `Step ${currentIdx + 1} of ${stepCount}`
        }
        onJump={(i) => toggle(i)}
      />

      <p className="sk-text-md-regular text-sk-text-secondary">{activity.intro}</p>

      <ol className="flex flex-col gap-2">
        {activity.steps.map((s, i) => {
          const isDone = done.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={isDone}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-border-brand",
                  isDone
                    ? "border-sk-text-success-primary bg-sk-bg-success-primary"
                    : "border-sk-border-secondary hover:border-sk-border-primary",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    isDone
                      ? "bg-sk-bg-success-solid text-sk-fg-white"
                      : "border-2 border-sk-border-primary",
                  )}
                >
                  {isDone ? <Icon icon={Check} size={12} /> : null}
                </span>
                <span>
                  <span className="sk-text-sm-semibold block text-sk-text-primary">{s.title}</span>
                  <span className="sk-text-sm-regular mt-0.5 block text-sk-text-secondary">
                    {s.detail}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {allDone ? (
        <InlineAlert tone="success" title="Activity complete" description="Nice work. Every step is done." />
      ) : null}
    </div>
  );
}

/* ---- SCORM-backed activity: the package runs in the platform's iframe ---- */
function ScormActivity({
  title,
  packageLabel,
  packageSizeLabel,
  isCompleted,
  onComplete,
}: {
  title: string;
  packageLabel?: string;
  packageSizeLabel?: string;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [state, setState] = React.useState<ScormState>("idle");
  const showToast = useLmsStore((s) => s.showToast);

  function launch() {
    setState("loading");
    // Stand-in for the iframe handshake; the real package reports back itself.
    window.setTimeout(() => setState("ready"), 900);
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <ScormContainer
        title={title}
        packageLabel={packageLabel}
        packageSizeLabel={packageSizeLabel}
        state={state}
        onLaunch={launch}
        onRetry={launch}
        onSkip={() => showToast("Skipped. This activity doesn't affect your grade.")}
        onFullscreen={() => showToast("Opening the activity fullscreen…")}
      />

      {/* Demo affordance: the error state is the one worth showing people. */}
      {state !== "error" ? (
        <div>
          <Button variant="secondary" size="sm" onClick={() => setState("error")}>
            Simulate load failure
          </Button>
        </div>
      ) : null}

      {isCompleted ? (
        <InlineAlert tone="success" title="Activity complete" description="Nice work." />
      ) : state === "ready" ? (
        <div>
          <Button variant="primary" onClick={onComplete}>
            Mark as complete
          </Button>
        </div>
      ) : null}
    </div>
  );
}
