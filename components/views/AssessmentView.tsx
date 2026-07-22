"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, AlertTriangle } from "lucide-react";
import { QuizCard } from "@/components/organisms/QuizCard";
import { QuizProgressRail, type QuizQuestionState } from "@/components/molecules/QuizProgressRail";
import { FileUploadZone } from "@/components/molecules/FileUploadZone";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { getQuiz, getQuizConfig, topicFamily, type QuizConfig } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function AssessmentView({ topicId, courseSlug = "six-sigma" }: { topicId: string; courseSlug?: string }) {
  const topic = getTopic(topicId);
  if (!topic) return null;
  // A "Graded Assignment" is a file submission; quizzes of every variant
  // (practice / graded / final) share one renderer and differ only by config.
  const isSubmission = topicFamily(topic.type) === "graded";
  return isSubmission ? <GradedSubmission topicId={topicId} /> : <Quiz topicId={topicId} courseSlug={courseSlug} />;
}

/* ---- Quiz: entry → per-question flow → summary. Config drives the shell. ---- */
function Quiz({ topicId, courseSlug }: { topicId: string; courseSlug: string }) {
  const topic = getTopic(topicId)!;
  const router = useRouter();
  const questions = React.useMemo(() => getQuiz(topic), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const config = React.useMemo(() => getQuizConfig(topic), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  const stored = useLmsStore((s) => s.quizResults[topicId]);
  const isCompleted = useLmsStore((s) => s.completedTopics.has(topicId));
  const recordQuizResult = useLmsStore((s) => s.recordQuizResult);
  const showToast = useLmsStore((s) => s.showToast);

  const total = questions.length;
  const result = stored ?? (isCompleted ? { score: total, total, attempts: 1 } : undefined);

  const [phase, setPhase] = React.useState<"intro" | "quiz" | "completed">(
    result ? "completed" : "intro",
  );
  const [qIndex, setQIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  const [revealed, setRevealed] = React.useState(false);
  const [draftSaved, setDraftSaved] = React.useState(false);
  /** Per-question outcome, drives the progress rail and the results map. */
  const [outcomes, setOutcomes] = React.useState<(boolean | null)[]>(() =>
    Array(total).fill(null),
  );
  /** Only these are replayed when the learner retries just the wrong ones. */
  const [retryOnly, setRetryOnly] = React.useState<number[] | null>(null);

  const attemptsUsed = result?.attempts ?? 0;
  const attemptsExhausted =
    typeof config.maxAttempts === "number" && attemptsUsed >= config.maxAttempts;

  function startAttempt(indices?: number[]) {
    setRetryOnly(indices ?? null);
    setQIndex(indices?.[0] ?? 0);
    setSelected(undefined);
    setRevealed(false);
    setDraftSaved(false);
    setOutcomes(indices ? outcomes.map((o, i) => (indices.includes(i) ? null : o)) : Array(total).fill(null));
    setPhase("quiz");
  }

  if (phase === "completed" && result) {
    return (
      <QuizSummary
        topic={topic}
        config={config}
        result={result}
        outcomes={outcomes}
        attemptsExhausted={attemptsExhausted}
        onRetake={() => startAttempt()}
        onRetryIncorrect={(idx) => startAttempt(idx)}
      />
    );
  }

  if (phase !== "quiz") {
    return (
      <div className="py-4">
        <QuizEntryHeader
          topic={topic}
          config={config}
          questionCount={total}
          resumed={false}
          onStart={() => {
            track("topic_enter", { topicId, kind: "quiz_start" });
            startAttempt();
          }}
        />
      </div>
    );
  }

  const q = questions[qIndex];
  const sequence = retryOnly ?? questions.map((_, i) => i);
  const posInSequence = sequence.indexOf(qIndex);
  const isLastInSequence = posInSequence === sequence.length - 1;

  const railStates: QuizQuestionState[] = outcomes.map((o, i) =>
    i === qIndex && o === null ? "current" : o === null ? "unanswered" : o ? "correct" : "incorrect",
  );

  return (
    <div className="flex flex-col gap-3 py-4">
      <QuizProgressRail
        states={railStates}
        currentIndex={qIndex}
        onJump={(i) => {
          // Only already-answered questions can be revisited mid-attempt.
          if (outcomes[i] === null) return;
          setQIndex(i);
          setSelected(undefined);
          setRevealed(true);
        }}
      />

      <p className="sk-text-2xs-medium text-sk-text-tertiary">
        Question {posInSequence + 1} of {sequence.length}
        {config.weightPct ? ` · ${config.label}` : ""}
      </p>

      <QuizCard
        state={revealed ? "Revealed" : "Question"}
        question={q.question}
        options={q.options}
        explanation={q.explanation}
        reviewTopicTitle={q.reviewTopicTitle}
        onReviewTopic={() => {
          if (q.reviewTopicId) router.push(`/course/${courseSlug}/topic/${q.reviewTopicId}`);
        }}
        selectedId={selected}
        onSelect={(id) => {
          if (revealed) return;
          setSelected(id);
          setDraftSaved(false);
        }}
        showSaveDraft={config.submitIsFinal}
        draftSaved={draftSaved}
        onSaveDraft={() => {
          setDraftSaved(true);
          showToast("Draft saved — not submitted yet.");
        }}
        attemptsUsed={config.maxAttempts ? attemptsUsed : undefined}
        maxAttempts={config.maxAttempts}
        isLastAttempt={
          config.submitIsFinal &&
          typeof config.maxAttempts === "number" &&
          attemptsUsed === config.maxAttempts - 1
        }
        onSubmit={() => {
          if (!selected) return;
          const correct = Boolean(q.options.find((o) => o.id === selected)?.correct);
          setOutcomes((prev) => prev.map((o, i) => (i === qIndex ? correct : o)));
          setRevealed(true);
        }}
        nextLabel={isLastInSequence ? "See results" : "Next question"}
        onNext={() => {
          if (!isLastInSequence) {
            setQIndex(sequence[posInSequence + 1]);
            setSelected(undefined);
            setRevealed(false);
            setDraftSaved(false);
            return;
          }
          const score = outcomes.filter(Boolean).length;
          recordQuizResult(topicId, score, total);
          setPhase("completed");
        }}
      />

    </div>
  );
}

/* ---- Entry header: everything the learner needs before starting (M1) ---- */
function QuizEntryHeader({
  topic,
  config,
  questionCount,
  resumed,
  onStart,
}: {
  topic: { title: string };
  config: QuizConfig;
  questionCount: number;
  resumed: boolean;
  onStart: () => void;
}) {
  const facts = [
    `${questionCount} questions`,
    `~${config.estMinutes} min`,
    config.maxAttempts ? `${config.maxAttempts} attempts per question` : "Unlimited attempts",
    `Pass ≥ ${config.passThresholdPct}%`,
  ];

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={config.variant === "practice" ? "success" : "brand"}>{config.label}</Badge>
        <Badge tone="neutral">
          {config.weightPct
            ? `Counts ${config.weightPct}% of your final grade`
            : "Doesn't affect your grade"}
        </Badge>
      </div>

      <h3 className="sk-text-lg-semibold text-sk-text-primary">{topic.title}</h3>

      <ul className="flex flex-wrap gap-2">
        {facts.map((f) => (
          <li
            key={f}
            className="sk-text-xs-regular rounded-md bg-sk-bg-secondary px-2.5 py-1 text-sk-text-secondary"
          >
            {f}
          </li>
        ))}
      </ul>

      {config.submitIsFinal ? (
        <InlineAlert
          tone="warning"
          title="Submit is final per question"
          description="Once you submit an answer you can't change it within that attempt."
        />
      ) : (
        <p className="sk-text-sm-regular text-sk-text-secondary">
          Check your understanding before moving on. You can retake this as many times as you like.
        </p>
      )}

      <div>
        <Button variant="primary" size="lg" onClick={onStart}>
          {resumed ? "Resume quiz" : `Start ${config.variant === "practice" ? "practice" : "quiz"}`}
        </Button>
      </div>
    </section>
  );
}

/* ---- Results summary: score, per-question map, retry paths (M4) ---- */
function QuizSummary({
  topic,
  config,
  result,
  outcomes,
  attemptsExhausted,
  onRetake,
  onRetryIncorrect,
}: {
  topic: { title: string };
  config: QuizConfig;
  result: { score: number; total: number; attempts: number };
  outcomes: (boolean | null)[];
  attemptsExhausted: boolean;
  onRetake: () => void;
  onRetryIncorrect: (indices: number[]) => void;
}) {
  const pct = Math.round((result.score / result.total) * 100);
  const passed = pct >= config.passThresholdPct;
  const incorrectIdx = outcomes
    .map((o, i) => (o === false ? i : -1))
    .filter((i) => i >= 0);

  return (
    <div className="flex flex-col gap-4 py-4">
      <section className="flex flex-col gap-4 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="sk-text-2xs-medium text-sk-text-brand-secondary">{config.label}</p>
            <h3 className="sk-text-md-semibold mt-1 text-sk-text-primary">{topic.title}</h3>
          </div>
          <Badge tone={passed ? "success" : "warning"} leftIcon={passed ? Check : AlertTriangle}>
            {passed ? "Passed" : "Not passed"}
          </Badge>
        </div>

        <div
          className={cn(
            "flex items-center gap-4 rounded-lg p-4",
            passed ? "bg-sk-bg-success-primary" : "bg-sk-bg-warning-primary",
          )}
        >
          <span className="sk-text-display-sm-semibold text-sk-text-primary">{pct}%</span>
          <div>
            <p className="sk-text-sm-semibold text-sk-text-primary">
              You scored {result.score} / {result.total}
            </p>
            <p className="sk-text-xs-regular text-sk-text-secondary">
              Pass mark {config.passThresholdPct}%
              {config.weightPct ? ` · counts ${config.weightPct}% of your final grade` : ""}
            </p>
          </div>
        </div>

        {/* Per-question map — jump back to any answer. */}
        {outcomes.some((o) => o !== null) ? (
          <div className="flex flex-col gap-2">
            <span className="sk-text-2xs-medium uppercase tracking-wide text-sk-text-tertiary">
              Your answers
            </span>
            <ol className="flex flex-wrap gap-1.5">
              {outcomes.map((o, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-medium",
                    o === true
                      ? "border-sk-text-success-primary bg-sk-bg-success-primary text-sk-text-success-primary"
                      : o === false
                        ? "border-sk-text-error-primary bg-sk-bg-error-primary text-sk-text-error-primary"
                        : "border-sk-border-primary text-sk-text-tertiary",
                  )}
                  aria-label={`Question ${i + 1} ${o === true ? "correct" : o === false ? "incorrect" : "unanswered"}`}
                >
                  {i + 1}
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sk-border-secondary pt-4">
          <p className="sk-text-xs-regular text-sk-text-tertiary">
            {result.attempts} {result.attempts === 1 ? "attempt" : "attempts"} ·{" "}
            {config.maxAttempts ? `${config.maxAttempts} allowed` : "Unlimited retakes"}
          </p>
          <div className="flex flex-wrap gap-2">
            {incorrectIdx.length && !attemptsExhausted ? (
              <Button variant="primary" onClick={() => onRetryIncorrect(incorrectIdx)}>
                Retry incorrect ({incorrectIdx.length})
              </Button>
            ) : null}
            <Button
              variant="secondary"
              leftIcon={RotateCcw}
              onClick={onRetake}
              disabled={attemptsExhausted}
            >
              {attemptsExhausted ? "No attempts left" : "Retake quiz"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- Graded assignment: brief + file upload + submit ---- */
function GradedSubmission({ topicId }: { topicId: string }) {
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <div className="flex flex-col gap-5 py-4">
      <section className="rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5">
        <p className="sk-text-2xs-medium mb-2 text-sk-text-brand-secondary">Assignment brief</p>
        <p className="sk-text-md-regular text-sk-text-secondary">
          Define a control plan for a process of your choice. Identify the critical-to-quality
          characteristics, the metrics you&rsquo;ll monitor, the control limits, and the response
          plan when a measurement falls out of range. Submit your plan as a PDF or DOCX.
        </p>
        <ul className="sk-text-sm-regular mt-3 list-disc pl-5 text-sk-text-secondary">
          <li>1–2 pages</li>
          <li>Include at least one control chart sketch</li>
          <li>Counts toward your final grade</li>
        </ul>
      </section>

      {submitted ? (
        <InlineAlert
          tone="success"
          title="Submission received"
          description="Your instructor will review it and you'll be notified when it's graded."
        />
      ) : (
        <>
          <FileUploadZone requiredCount={1} uploadedFiles={[]} />
          <div className="flex justify-end">
            <Button variant="primary" size="lg" onClick={() => setSubmitted(true)}>
              Submit assignment
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
