"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import { QuizCard } from "@/components/organisms/QuizCard";
import { QuizProgressBar } from "@/components/molecules/QuizProgressBar";
import { FileUploadZone } from "@/components/molecules/FileUploadZone";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { getQuiz, getQuizConfig, topicFamily, type QuizConfig } from "@/lib/content";
import { getCourseBySlug, getTopic } from "@/lib/data";
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

/* ---- Quiz: entry → one question per step → summary. ----
   Mirrors Open edX's native sequence navigation. The *subsection* is the quiz
   container; authoring one `problem` per unit makes the platform render exactly
   this stepper (unit navigator + Previous/Next) with no custom code. Submit
   stays per problem block: Open edX has no quiz-level submit-all, so each
   question still grades on its own. Position and progress come from the DS
   `Quiz · Progress Bar`; stepping is carried by the Previous/Next controls.
   The end-of-quiz summary is ours, the platform ships no results screen. */
type Answer = { selected: string[]; revealed: boolean; draftSaved: boolean };
const freshAnswer = (): Answer => ({ selected: [], revealed: false, draftSaved: false });

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
  const [answers, setAnswers] = React.useState<Answer[]>(() => questions.map(freshAnswer));
  // The step the learner is on — the equivalent of the sequence `position` the
  // platform persists per subsection.
  const [index, setIndex] = React.useState(0);
  const recordedRef = React.useRef(false);
  const stepRef = React.useRef<HTMLDivElement>(null);
  const mountedRef = React.useRef(false);

  const isQuestionCorrect = React.useCallback(
    (i: number): boolean => {
      const q = questions[i];
      const sel = answers[i].selected;
      return q.multiSelect
        ? sel.length > 0 && q.options.every((o) => Boolean(o.correct) === sel.includes(o.id))
        : Boolean(q.options.find((o) => o.id === sel[0])?.correct);
    },
    [answers, questions],
  );

  const outcomes: (boolean | null)[] = answers.map((a, i) => (a.revealed ? isQuestionCorrect(i) : null));
  const answeredCount = answers.filter((a) => a.revealed).length;
  const allAnswered = total > 0 && answeredCount === total;
  const score = outcomes.filter(Boolean).length;

  const attemptsUsed = result?.attempts ?? 0;
  const attemptsExhausted =
    typeof config.maxAttempts === "number" && attemptsUsed >= config.maxAttempts;

  // No quiz-level submit on the platform — we record the aggregate once every
  // question has a submitted state.
  React.useEffect(() => {
    if (phase === "quiz" && allAnswered && !recordedRef.current) {
      recordedRef.current = true;
      recordQuizResult(topicId, score, total);
    }
  }, [phase, allAnswered, score, total, topicId, recordQuizResult]);

  // Stepping to another question re-anchors the view, the way navigating to
  // another unit resets the page. Skipped on first render.
  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [index]);

  function startAttempt(indices?: number[]) {
    recordedRef.current = false;
    setAnswers((prev) =>
      questions.map((_, i) => (indices && !indices.includes(i) ? prev[i] : freshAnswer())),
    );
    setIndex(indices?.[0] ?? 0);
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

  const q = questions[index];
  const isLast = index === total - 1;

  // "Review lesson" only appears when the question is actually linked to a
  // lesson *in this course*. A course-final quiz has no such link, and a quiz
  // reused across courses must not deep-link into a topic that isn't there
  // (workshop, 00:30:31). Resolving against the course also keeps the label
  // truthful if the topic is later renamed.
  const reviewTopic = q.reviewTopicId
    ? getTopic(q.reviewTopicId, getCourseBySlug(courseSlug))
    : undefined;

  return (
    <div ref={stepRef} className="flex scroll-mt-4 flex-col gap-4 py-4">
      {/* Position + progress, per the DS `Quiz · Progress Bar` variant. The dot
          rail it replaces doubled as a jump-to-question navigator, so stepping
          is now carried entirely by the Previous/Next controls below — which is
          also the platform's own default since the unit tab bar moved behind a
          plugin slot. */}
      <QuizProgressBar
        current={index + 1}
        total={total}
        pct={(answeredCount / total) * 100}
      />

      <QuizCard
        state={answers[index].revealed ? "Revealed" : "Question"}
        question={q.question}
        options={q.options}
        multiSelect={q.multiSelect}
        explanation={q.explanation}
        reviewTopicTitle={reviewTopic?.title}
        onReviewTopic={() => {
          if (reviewTopic) router.push(`/course/${courseSlug}/topic/${reviewTopic.id}`);
        }}
        selectedIds={answers[index].selected}
        onToggleOption={(id) =>
          setAnswers((prev) =>
            prev.map((a, j) => {
              if (j !== index || a.revealed) return a;
              const has = a.selected.includes(id);
              const selected = q.multiSelect
                ? has
                  ? a.selected.filter((x) => x !== id)
                  : [...a.selected, id]
                : [id];
              return { ...a, selected, draftSaved: false };
            }),
          )
        }
        showSaveDraft={config.submitIsFinal}
        draftSaved={answers[index].draftSaved}
        onSaveDraft={() => {
          setAnswers((prev) => prev.map((a, j) => (j === index ? { ...a, draftSaved: true } : a)));
          showToast("Draft saved, not submitted yet.");
        }}
        attemptsUsed={config.maxAttempts ? attemptsUsed : undefined}
        maxAttempts={config.maxAttempts}
        isLastAttempt={
          config.submitIsFinal &&
          typeof config.maxAttempts === "number" &&
          attemptsUsed === config.maxAttempts - 1
        }
        onSubmit={() =>
          setAnswers((prev) => prev.map((a, j) => (j === index ? { ...a, revealed: true } : a)))
        }
      />

      {/* Step controls — the platform renders Previous/Next around every unit.
          Both say "question" so they never read as the player's topic nav,
          which sits directly below them. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="secondary"
          leftIcon={ArrowLeft}
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Previous question
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {!isLast ? (
            <Button
              variant={allAnswered ? "secondary" : "primary"}
              rightIcon={ArrowRight}
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            >
              Next question
            </Button>
          ) : null}
          {allAnswered ? (
            <Button variant="primary" onClick={() => setPhase("completed")}>
              See results
            </Button>
          ) : null}
        </div>
      </div>

      {/* Until every question is answered, name what is still outstanding —
          the platform gives learners no such cue. */}
      {!allAnswered ? (
        <p className="sk-text-xs-regular text-center text-sk-text-tertiary">
          {total - answeredCount} of {total} still unanswered
        </p>
      ) : null}
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
