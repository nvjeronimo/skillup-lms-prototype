"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { FIELD, FormField, FormModal } from "@/components/organisms/FormModal";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** A sample private feed address: one per learner, revocable. */
const FEED = "webcal://learn.skillup.online/calendar/feed/js-7f3a9c.ics";

const APPS = ["Google Calendar", "Outlook", "Apple Calendar"] as const;

const WHAT = [
  { id: "deadline", label: "Deadlines", hint: "Assignments, quizzes and exams" },
  { id: "course", label: "Course dates", hint: "Starts, ends, verification" },
  { id: "live", label: "Live sessions", hint: "And sessions you book in Services" },
] as const;

/**
 * Calendar sync (Calendar → Add to your calendar; Nelson, 23 Oct 2026). What goes in the feed
 * (deadlines, course dates, live sessions; all on by default), one button per calendar app and
 * the private feed address to copy. Open edX syncs one course at a time (the Dates tab's
 * "Sync to calendar", an .ics per course); one feed for every course is Phase 3 (feature
 * deltas). Nothing is subscribed in the prototype: the app buttons and Copy say what they would do.
 */
export function CalendarSyncModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const id = React.useId();
  const showToast = useLmsStore((s) => s.showToast);
  const [on, setOn] = React.useState<Record<string, boolean>>({ deadline: true, course: true, live: true });

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Add to your calendar"
      description="Your dates stay up to date in your own calendar app. Changes can take a few hours to show."
      submitLabel="Done"
      doneOnly
      canSubmit
      onSubmit={onClose}
      mock="Calendar sync is Phase 3 (feature deltas); the feed address is a sample"
    >
      <fieldset className="flex flex-col gap-1.5">
        <legend className="sk-text-body-medium-medium mb-1.5 text-sko-text-muted">What to include</legend>
        {WHAT.map((w) => (
          <label
            key={w.id}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-3 rounded-control border px-3 py-2.5 transition-colors",
              on[w.id] ? "border-sko-border-primary bg-sko-bg-primary-soft" : "border-sko-border-subtle hover:bg-sko-bg-hover",
            )}
          >
            <input
              type="checkbox"
              checked={on[w.id]}
              onChange={(e) => setOn((o) => ({ ...o, [w.id]: e.target.checked }))}
              className="size-4 shrink-0 rounded-inner accent-[var(--color-bg-primary)]"
            />
            <span className="flex min-w-0 flex-col">
              <span className="sk-text-body-medium-medium text-sko-text-default">{w.label}</span>
              <span className="sk-text-body-small-regular text-sko-text-subtle">{w.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <p className="sk-text-body-medium-medium text-sko-text-muted">Add it to</p>
        <div className="grid gap-2 md:grid-cols-3">
          {APPS.map((app) => (
            <Button key={app} type="button" hierarchy="secondary" size="md" onClick={() => showToast(`Opening ${app}…`)}>
              {app}
            </Button>
          ))}
        </div>
      </div>

      <FormField id={`${id}-feed`} label="Or copy the feed address" hint="Private to you. Anyone with it can see your dates.">
        <div className="flex gap-2">
          <input id={`${id}-feed`} value={FEED} readOnly aria-describedby={`${id}-feed-hint`} className={cn(FIELD, "min-w-0 flex-1 bg-sko-bg-muted text-sko-text-subtle shadow-none")} />
          <Button
            type="button"
            hierarchy="secondary"
            size="md"
            leftIcon={Copy}
            onClick={() => {
              void navigator.clipboard?.writeText(FEED).catch(() => undefined);
              showToast("Feed address copied");
            }}
            className="shrink-0 max-md:h-11"
          >
            Copy
          </Button>
        </div>
      </FormField>
    </FormModal>
  );
}
