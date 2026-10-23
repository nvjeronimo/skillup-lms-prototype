"use client";

import * as React from "react";
import { ChoiceGroup, FormModal } from "@/components/organisms/FormModal";
import type { SessionGoal } from "@/lib/platform/session-additions";

/** Open edX's three weekly learning goals (course goals API, `days_per_week`). */
export const GOAL_LEVELS = [
  { value: "1", label: "Casual", hint: "1 day a week" },
  { value: "3", label: "Regular", hint: "3 days a week" },
  { value: "5", label: "Intense", hint: "5 days a week" },
] as const;

export type GoalLevel = (typeof GOAL_LEVELS)[number]["value"];

/** "Regular · 3 days a week." → "3". */
export function levelOfPlan(plan: string): GoalLevel {
  return GOAL_LEVELS.find((l) => plan.startsWith(l.label))?.value ?? "3";
}

/**
 * Edit weekly goal (Course Detail → Weekly goal; Nelson, 23 Oct 2026). Open edX's own choice,
 * as its Course Home offers it: Casual (1 day a week), Regular (3) or Intense (5), and whether to
 * get a reminder email when the week is slipping (`subscribed_to_reminders`). A day counts when
 * the learner opens any lesson. Nothing is sent: the card shows the new goal for the session.
 */
export function WeeklyGoalModal({
  open,
  onClose,
  current,
  reminders: currentReminders,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  current: GoalLevel;
  reminders: boolean;
  onSaved: (goal: SessionGoal) => void;
}) {
  const [level, setLevel] = React.useState<GoalLevel>(current);
  const [reminders, setReminders] = React.useState(currentReminders);

  React.useEffect(() => {
    if (open) {
      setLevel(current);
      setReminders(currentReminders);
    }
  }, [open, current, currentReminders]);

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Your weekly goal"
      description="How many days a week do you want to learn in this course? A day counts when you open any lesson."
      submitLabel="Save goal"
      canSubmit
      onSubmit={() => onSaved({ days: Number(level), reminders })}
    >
      <ChoiceGroup legend="Days a week" value={level} onChange={setLevel} options={GOAL_LEVELS} columns={3} />
      <label className="flex min-h-11 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={reminders}
          onChange={(e) => setReminders(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded-inner accent-[var(--color-bg-primary)]"
        />
        <span className="flex flex-col">
          <span className="sk-text-body-medium-medium text-sko-text-default">Remind me by email</span>
          <span className="sk-text-body-small-regular text-sko-text-subtle">When I am behind on my goal for the week.</span>
        </span>
      </label>
    </FormModal>
  );
}
