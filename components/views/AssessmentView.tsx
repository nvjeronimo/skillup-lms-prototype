"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, AlertTriangle } from "lucide-react";
import { QuizCard } from "@/components/organisms/QuizCard";
import { QuizProgressBar } from "@/components/molecules/QuizProgressBar";
import { FileUploadZone } from "@/components/molecules/FileUploadZone";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import {
  ATTEMPTS_DISPLAY_CEILING,
  getQuiz,
  getQuizConfig,
  topicFamily,
  type QuizConfig,
} from "@/lib/content";
import { flatTopics, getCourseBySlug, getTopic } from "@/lib/data";
import type { Course, FlatTopic } from "@/lib/types";
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
          /* Shell-owned, resolved from course structure — never authored into
             the quiz. A lesson wins over a module because it is the nearer
             parent; with neither, the quiz spans the course and the action is
             suppressed. */
          reviewParent={topic.lessonLabel ? "lesson" : topic.moduleTitle ? "module" : undefined}
          onReviewParent={() => {
            const first = firstTopicOfParent(topic, getCourseBySlug(courseSlug));
            if (first) router.push(`/course/${courseSlug}/topic/${first}`);
          }}
        />
      </div>
    );
  }

  const q = questions[index];

  /**
   * Next question still awaiting an answer, wrapping past the end. Skipping is
   * allowed, so "forward" cannot mean index+1 — that would strand the learner
   * on the last question with earlier ones still open.
   */
  function nextUnanswered(from: number): number {
    for (let k = from + 1; k < total; k++) if (!answers[k].revealed) return k;
    for (let k = 0; k <= from; k++) if (!answers[k].revealed) return k;
    return -1;
  }

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
      <QuizCard
        /* The card owns position and the forward action. A second bar of step
           controls collided with the player's own Previous/Next at the foot of
           the screen; the DS puts Skip and Next in the action row instead. */
        progress={
          <QuizProgressBar
            current={index + 1}
            total={total}
            pct={(answeredCount / total) * 100}
          />
        }
        onSkip={
          allAnswered || nextUnanswered(index) < 0
            ? undefined
            : () => setIndex(nextUnanswered(index))
        }
        onNext={
          allAnswered ? () => setPhase("completed") : () => setIndex(nextUnanswered(index))
        }
        nextLabel={allAnswered ? "See results" : "Next question"}
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
        attemptsUsed={
          typeof config.maxAttempts === "number" &&
          config.maxAttempts <= ATTEMPTS_DISPLAY_CEILING
            ? attemptsUsed
            : undefined
        }
        maxAttempts={
          typeof config.maxAttempts === "number" &&
          config.maxAttempts <= ATTEMPTS_DISPLAY_CEILING
            ? config.maxAttempts
            : undefined
        }
        isLastAttempt={
          config.submitIsFinal &&
          typeof config.maxAttempts === "number" &&
          attemptsUsed === config.maxAttempts - 1
        }
        onSubmit={() =>
          setAnswers((prev) => prev.map((a, j) => (j === index ? { ...a, revealed: true } : a)))
        }
      />
    </div>
  );
}

/**
 * First topic of the quiz's nearest parent (its lesson, else its module), so
 * "Review lesson first" lands at the start of the material rather than on the
 * quiz's neighbour. Returns undefined when the quiz has no parent, which is
 * also what suppresses the action.
 */
function firstTopicOfParent(quiz: FlatTopic, course: Course): string | undefined {
  const siblings = flatTopics(course).filter((t) =>
    quiz.lessonLabel ? t.lessonLabel === quiz.lessonLabel : t.moduleId === quiz.moduleId,
  );
  const first = siblings.find((t) => t.id !== quiz.id);
  return first?.id;
}

/* ---- Entry header: everything the learner needs before starting (M1) ---- */
function QuizEntryHeader({
  topic,
  config,
  questionCount,
  resumed,
  onStart,
  reviewParent,
  onReviewParent,
}: {
  topic: { title: string };
  config: QuizConfig;
  questionCount: number;
  resumed: boolean;
  /** "lesson" / "module" — omitted when the quiz has no parent to review. */
  reviewParent?: string;
  onReviewParent?: () => void;
  onStart: () => void;
}) {
  // The platform has no "unlimited" attempts setting, so we never promise it.
  // A high ceiling is how authors express "as often as you like"; above it the
  // number is noise, so the fact is dropped rather than restated as a word the
  // backend cannot return.
  const showAttempts =
    typeof config.maxAttempts === "number" && config.maxAttempts <= ATTEMPTS_DISPLAY_CEILING;
  const facts = [
    `${questionCount} questions`,
    `~${config.estMinutes} min`,
    ...(showAttempts ? [`${config.maxAttempts} attempts per question`] : []),
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

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" size="lg" onClick={onStart}>
          {resumed ? "Resume quiz" : `Start ${config.variant === "practice" ? "practice" : "quiz"}`}
        </Button>

        {/* Secondary action only when there is somewhere to send the learner
            back to. A course-final quiz belongs to the whole course, so it has
            no parent to review — and what decides this is the link, not the
            quiz variant: a module-level final exam does have one. */}
        {reviewParent ? (
          <Button variant="secondary" size="lg" onClick={onReviewParent}>
            Review {reviewParent} first
          </Button>
        ) : null}
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

        {/* No per-question circle map. The ruling that removed the dots from
            the progress indicator covers the results screen too: "Retry
            incorrect" already names how many were wrong and takes the learner
            straight to them, so a row of circles adds nothing on a long quiz. */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sk-border-secondary pt-4">
          <p className="sk-text-xs-regular text-sk-text-tertiary">
            {result.attempts} {result.attempts === 1 ? "attempt" : "attempts"}
            {typeof config.maxAttempts === "number" &&
            config.maxAttempts <= ATTEMPTS_DISPLAY_CEILING
              ? ` · ${config.maxAttempts - result.attempts} left`
              : ""}
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
