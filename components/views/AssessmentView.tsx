"use client";

import * as React from "react";
import { QuizCard } from "@/components/organisms/QuizCard";
import { FileUploadZone } from "@/components/molecules/FileUploadZone";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Button } from "@/components/atoms/Button";
import { getQuiz, topicFamily } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { track } from "@/lib/analytics";

export function AssessmentView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  if (!topic) return null;
  const graded = topicFamily(topic.type) === "graded";
  return graded ? <GradedSubmission topicId={topicId} /> : <Quiz topicId={topicId} />;
}

/* ---- Practice / Quiz: interactive multi-question flow ---- */
function Quiz({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId)!;
  const questions = React.useMemo(() => getQuiz(topic), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [phase, setPhase] = React.useState<"start" | "quiz" | "results">("start");
  const [qIndex, setQIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  const [revealed, setRevealed] = React.useState(false);
  const [correct, setCorrect] = React.useState(0);

  const q = questions[qIndex];
  const passed = correct >= Math.ceil(questions.length * 0.6);

  if (phase === "start") {
    return (
      <div className="py-4">
        <QuizCard
          state="Start"
          onSubmit={() => {
            track("topic_enter", { topicId, kind: "quiz_start" });
            setPhase("quiz");
          }}
        />
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="flex flex-col gap-4 py-4">
        <QuizCard
          state={passed ? "Results" : "Not Passed"}
          question={`You scored ${correct} / ${questions.length}`}
          options={q.options}
          selectedId={selected}
          onSubmit={() => {
            setPhase("start");
            setQIndex(0);
            setSelected(undefined);
            setRevealed(false);
            setCorrect(0);
          }}
        />
      </div>
    );
  }

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
          track("topic_complete", { topicId, kind: "quiz_answer" });
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
                setPhase("results");
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
