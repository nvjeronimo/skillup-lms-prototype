"use client";

import * as React from "react";
import { Check, RotateCcw } from "lucide-react";
import { QuizCard } from "@/components/organisms/QuizCard";
import { FileUploadZone } from "@/components/molecules/FileUploadZone";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { getQuiz, topicFamily } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function AssessmentView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  if (!topic) return null;
  const graded = topicFamily(topic.type) === "graded";
  return graded ? <GradedSubmission topicId={topicId} /> : <Quiz topicId={topicId} />;
}

/* ---- Practice / Quiz: interactive multi-question flow + persistent result ---- */
function Quiz({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId)!;
  const questions = React.useMemo(() => getQuiz(topic), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  const result = useLmsStore((s) => s.quizResults[topicId]);
  const recordQuizResult = useLmsStore((s) => s.recordQuizResult);

  // Show the completed summary when a result exists and we're not mid-retake.
  const [phase, setPhase] = React.useState<"intro" | "quiz" | "completed">(
    result ? "completed" : "intro",
  );
  const [qIndex, setQIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  const [revealed, setRevealed] = React.useState(false);
  const [correct, setCorrect] = React.useState(0);

  function startAttempt() {
    setQIndex(0);
    setSelected(undefined);
    setRevealed(false);
    setCorrect(0);
    setPhase("quiz");
  }

  if (phase === "completed" && result) {
    return <QuizSummary topic={topic} result={result} onRetake={startAttempt} />;
  }

  if (phase === "intro") {
    return (
      <div className="py-4">
        <QuizCard
          state="Start"
          onSubmit={() => {
            track("topic_enter", { topicId, kind: "quiz_start" });
            startAttempt();
          }}
        />
      </div>
    );
  }

  const q = questions[qIndex];
  return (
    <div className="flex flex-col gap-3 py-4">
      <p className="sk-text-2xs-medium text-sk-text-tertiary">
        Question {qIndex + 1} of {questions.length}
      </p>
      <QuizCard
        state={revealed ? "Revealed" : "Question"}
        question={q.question}
        options={q.options}
        selectedId={selected}
        onSelect={(id) => !revealed && setSelected(id)}
        onSubmit={() => {
          if (!selected) return;
          setRevealed(true);
          if (q.options.find((o) => o.id === selected)?.correct) setCorrect((c) => c + 1);
        }}
      />
      {revealed ? (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => {
              if (qIndex + 1 < questions.length) {
                setQIndex((i) => i + 1);
                setSelected(undefined);
                setRevealed(false);
              } else {
                recordQuizResult(topicId, correct, questions.length);
                setPhase("completed");
              }
            }}
          >
            {qIndex + 1 < questions.length ? "Next question" : "See results"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/* ---- Completed quiz: score summary + retake with attempt counter ---- */
function QuizSummary({
  topic,
  result,
  onRetake,
}: {
  topic: { title: string };
  result: { score: number; total: number; attempts: number };
  onRetake: () => void;
}) {
  const pct = Math.round((result.score / result.total) * 100);
  const passed = result.score >= Math.ceil(result.total * 0.6);
  return (
    <div className="flex flex-col gap-4 py-4">
      <section className="flex flex-col gap-4 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="sk-text-2xs-medium text-sk-text-brand-secondary">Practice quiz</p>
            <h3 className="sk-text-md-semibold mt-1 text-sk-text-primary">{topic.title}</h3>
          </div>
          <Badge tone={passed ? "success" : "warning"} leftIcon={passed ? Check : undefined}>
            {passed ? "Passed" : "Not passed"}
          </Badge>
        </div>

        {/* Score */}
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
              Pass mark 60% · {passed ? "Well done!" : "Give it another go to pass."}
            </p>
          </div>
        </div>

        {/* Retake + attempt counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sk-border-secondary pt-4">
          <p className="sk-text-xs-regular text-sk-text-tertiary">
            {result.attempts} {result.attempts === 1 ? "attempt" : "attempts"} · Unlimited retakes
          </p>
          <Button variant="secondary" leftIcon={RotateCcw} onClick={onRetake}>
            Retake quiz
          </Button>
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
