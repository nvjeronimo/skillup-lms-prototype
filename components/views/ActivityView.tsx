"use client";

import * as React from "react";
import { Ban, Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { EmptyState } from "@/components/atoms/EmptyState";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Button } from "@/components/atoms/Button";
import { ProgressRail, type RailItemState } from "@/components/molecules/ProgressRail";
import { ScormContainer, type ScormState } from "@/components/molecules/ScormContainer";
import { getActivity } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DemoOnly } from "@/lib/demo";
import { useEdxScope } from "@/lib/edx-scope";

export function ActivityView({ topicId }: { topicId: string }) {
  const isCompleted = useLmsStore((s) => s.completedTopics.has(topicId));
  const markComplete = useLmsStore((s) => s.markComplete);
  const edx = useEdxScope();

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
        key={topicId}
        topicId={topicId}
        title={topic.title}
        durationLabel={topic.duration.replace(/^approx\.\s*|\s*approx\.$/g, "")}
        isCompleted={isCompleted}
        onComplete={() => markComplete(topicId)}
      />
    );
  }

  // Open edX scope: the checklist (ticks saved per learner, the last tick completing the topic)
  // has no Open edX block behind it, so the body says so; a SCORM activity above is native.
  if (edx) {
    return (
      <div className="py-6">
        <EmptyState
          icon={Ban}
          title="Checklist activities are not in Open edX"
          description="An HTML component cannot save ticked steps for each learner or complete the topic on the last tick. In Open edX this activity would be a SCORM package."
        />
      </div>
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
    <div className="flex flex-col gap-6 py-6">
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

      <p className="sk-text-body-large-regular text-sko-text-muted">{activity.intro}</p>

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
                  "flex w-full items-start gap-3 rounded-card border p-4 text-left transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary",
                  isDone
                    ? "border-sko-border-success bg-sko-bg-success-soft"
                    : "border-sko-border-subtle hover:border-sko-border-default",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill",
                    isDone
                      ? "bg-sko-bg-success text-sko-text-on-media"
                      : "border-2 border-sko-border-default",
                  )}
                >
                  {isDone ? <Icon icon={Check} size={12} /> : null}
                </span>
                <span>
                  <span className="sk-text-body-medium-semibold block text-sko-text-default">{s.title}</span>
                  <span className="sk-text-body-medium-regular mt-0.5 block text-sko-text-muted">
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

/** What the package keeps between visits (its cmi suspend data and score), per topic. */
type ScormRecord = { answers: boolean[]; score?: number };
// Module memory stands in for the package's own suspend data: it survives moving between topics.
const SCORM_RECORDS = new Map<string, ScormRecord>();

/** A finished run of the sample package: five of six right, which it reports as 83 points. */
const REPORTED_SAMPLE: ScormRecord = { answers: [true, true, false, true, true, true], score: 83 };

/** The package's mastery score: its own setting, not the platform's (the package reports passed or failed). */
const PASS_SCORE = 70;

/** Sample package content: the author builds this in their tool; the platform only plays it. */
const SCENARIOS: { prompt: string; options: [string, string]; answer: 0 | 1 }[] = [
  { prompt: "A team stops building batches ahead of orders and starts work only when a customer asks. Which principle is that?", options: ["Pull", "Flow"], answer: 0 },
  { prompt: "Hand-offs between three desks are removed so a request moves through without waiting. Which principle is that?", options: ["Value", "Flow"], answer: 1 },
  { prompt: "Every step is drawn from request to delivery to find the ones that add nothing. Which principle is that?", options: ["Value stream", "Perfection"], answer: 0 },
  { prompt: "The team asks customers what they would pay for before changing the form. Which principle is that?", options: ["Value", "Pull"], answer: 0 },
  { prompt: "After each release the team meets to remove one more source of rework. Which principle is that?", options: ["Flow", "Perfection"], answer: 1 },
  { prompt: "Work in progress is capped so nothing waits half-finished. Which principle is that?", options: ["Pull", "Value"], answer: 0 },
];

/** The package as the iframe would show it: one scenario at a time, then its results. */
function SamplePackage({
  title,
  answers,
  onAnswer,
  onRestart,
}: {
  title: string;
  answers: boolean[];
  onAnswer: (correct: boolean) => void;
  onRestart: () => void;
}) {
  const done = answers.length >= SCENARIOS.length;
  const scenario = SCENARIOS[answers.length];
  return (
    <div className="flex flex-col gap-4 p-6 text-left md:p-8">
      <div className="flex items-center justify-between gap-4">
        <span className="sk-text-body-medium-regular text-sko-text-muted">
          {done ? "Results" : `Scenario ${answers.length + 1} of ${SCENARIOS.length}`}
        </span>
        <span className="sk-text-body-medium-regular truncate text-sko-text-muted">{title}</span>
      </div>
      {done ? (
        <>
          <p className="sk-text-headline-small-semibold text-sko-text-default">
            You got {answers.filter(Boolean).length} of {SCENARIOS.length} scenarios right.
          </p>
          <div>
            <Button variant="secondary" size="md" onClick={onRestart}>
              Start again
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="sk-text-title-large-semibold text-sko-text-default">{scenario.prompt}</p>
          <div className="flex flex-wrap gap-3">
            {scenario.options.map((o, i) => (
              <Button key={o} variant="secondary" size="lg" onClick={() => onAnswer(i === scenario.answer)}>
                {o}
              </Button>
            ))}
          </div>
        </>
      )}
      <p className="sk-text-body-medium-regular text-sko-text-muted">
        Sample package content: the author builds this in their tool; the platform only plays it.
      </p>
    </div>
  );
}

/**
 * The Activity as the Open edX SCORM XBlock plays it, in Figma's in-page model (ICP Activity page
 * 7428:1069; Nelson's SKO match review, 28 Oct 2026). The package plays in the page straight
 * away (A1 loading, A2 running); the XBlock's score line and status sit ABOVE the package, with
 * Fullscreen and "Launch unit in new window" (Row B). The package reports completion and its score
 * itself, so there is no Mark as Complete: coming back resumes it (A4), and once it has reported,
 * the alert gives "83 points out of 100" and passed (A5) or not passed (A6). The score also goes
 * to the Progress tab.
 */
function ScormActivity({
  topicId,
  title,
  durationLabel,
  isCompleted,
  onComplete,
}: {
  topicId: string;
  title: string;
  durationLabel: string;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const showToast = useLmsStore((s) => s.showToast);
  // What the package remembered when this visit started: it decides the "picking up" note.
  const [arrived] = React.useState<ScormRecord | undefined>(() => SCORM_RECORDS.get(topicId));
  // A topic completed before this visit: the package reported then (the sample's 5 of 6, 83 points).
  const [record, setRecord] = React.useState<ScormRecord>(
    () => arrived ?? (isCompleted ? REPORTED_SAMPLE : { answers: [] }),
  );
  const [state, setState] = React.useState<ScormState>("loading");
  const [openedAt, setOpenedAt] = React.useState<string>();

  const load = React.useCallback(() => {
    setState("loading");
    // Stand-in for the iframe handshake; the real package reports back itself.
    window.setTimeout(() => setState((s) => (s === "loading" ? "running" : s)), 900);
  }, []);
  React.useEffect(() => load(), [load]);

  function save(next: ScormRecord) {
    SCORM_RECORDS.set(topicId, next);
    setRecord(next);
  }
  function answer(correct: boolean) {
    const answers = [...record.answers, correct];
    if (answers.length < SCENARIOS.length) return save({ ...record, answers });
    // The last scenario: the package reports completed and its score (the last one is kept).
    const score = Math.round((answers.filter(Boolean).length / SCENARIOS.length) * 100);
    save({ answers, score });
    if (!isCompleted) onComplete();
  }
  function launchWindow() {
    setState("window");
    setOpenedAt(
      `today at ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
    );
    showToast("Opening the activity in a new window…");
  }

  const score = record.score;
  const resuming =
    score === undefined && Boolean(arrived?.answers.length) && record.answers.length > 0 && state !== "window";

  return (
    <div className="flex flex-col gap-4 py-6">
      <p className="sk-text-body-large-regular max-w-text text-pretty text-sko-text-default">
        {state === "window"
          ? "This activity opens in its own window. Your progress is saved as you go, and your completion and score come back to this page when you finish."
          : "This activity plays below. Your progress is saved as you go, and it reports your completion and score to the course when you finish."}
      </p>

      {/* The XBlock's score line and status, above the package. */}
      {score !== undefined ? (
        score >= PASS_SCORE ? (
          <InlineAlert
            tone="success"
            title={`Passed · ${score} points out of 100`}
            description="Your score is in the Progress tab. You can go through the activity again."
          />
        ) : (
          <InlineAlert
            tone="warning"
            title={`Not passed · ${score} points out of 100`}
            description="You can try again: start the activity from the beginning to improve your score."
          />
        )
      ) : resuming ? (
        <InlineAlert
          tone="info"
          title="Picking up where you left off"
          description={`You stopped at scenario ${arrived!.answers.length + 1} of ${SCENARIOS.length}. Your answers so far are saved.`}
        />
      ) : null}

      <ScormContainer
        title={title}
        state={state}
        openedAt={openedAt}
        durationLabel={durationLabel}
        onRetry={load}
        onSkip={() => showToast("Skipped. You can come back to this activity anytime.")}
        onLaunchWindow={launchWindow}
        onPlayInPage={load}
      >
        <SamplePackage
          title={title}
          answers={record.answers}
          onAnswer={answer}
          onRestart={() => save({ ...record, answers: [] })}
        />
      </ScormContainer>

      {/* Demo affordances: the error state, and a result arriving from the package window. */}
      <DemoOnly>
        <div className="flex flex-wrap gap-2">
          {state !== "error" ? (
            <Button variant="secondary" size="sm" onClick={() => setState("error")}>
              Simulate load failure
            </Button>
          ) : null}
          {state === "window" ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                // Five of six right: the package reports completed, 83 points.
                save(REPORTED_SAMPLE);
                if (!isCompleted) onComplete();
                load();
              }}
            >
              Simulate: finish in the window
            </Button>
          ) : null}
        </div>
      </DemoOnly>
    </div>
  );
}
