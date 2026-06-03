"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { getActivity } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ActivityView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const [done, setDone] = React.useState<Set<number>>(new Set());
  if (!topic) return null;
  const activity = getActivity(topic);
  const allDone = done.size === activity.steps.length;

  function toggle(i: number) {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <p className="lms-text-md-regular text-lms-text-secondary">{activity.intro}</p>

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
                  isDone
                    ? "border-lms-text-success-primary bg-lms-bg-success-primary"
                    : "border-lms-border-secondary hover:border-lms-border-primary",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    isDone
                      ? "bg-lms-text-success-primary text-lms-fg-white"
                      : "border-2 border-lms-border-primary",
                  )}
                >
                  {isDone ? <Icon icon={Check} size={12} /> : null}
                </span>
                <span>
                  <span className="lms-text-sm-semibold block text-lms-text-primary">{s.title}</span>
                  <span className="lms-text-sm-regular mt-0.5 block text-lms-text-secondary">
                    {s.detail}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {allDone ? (
        <InlineAlert tone="success" title="Activity complete" description="Nice work — every step is done." />
      ) : (
        <p className="lms-text-sm-regular text-lms-text-tertiary">
          {done.size} of {activity.steps.length} steps complete
        </p>
      )}
    </div>
  );
}
