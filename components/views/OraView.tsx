"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import {
  getOra,
  oraMaxPoints,
  type OraContent,
  type OraStep,
  type ReadingOpenResponse,
} from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * ORA — the only topic type the learner returns to over days or weeks.
 * Steps: Your response → Your grade. On SkillUp courses the ORA is graded by the course team
 * (staff or mentor) on a rubric: peer and self assessment are off, and no due date is set, since
 * SkillUp configures only the course start and end dates (decision 036; Nelson's SKO match
 * review, 28 Oct 2026, OR1). The waiting state carries as much weight as the form: the learner
 * has done everything and now depends on the course team, so the UI shows where it stands.
 *
 * Completion is the platform's, not the learner's: the topic completes by itself once the
 * learner has submitted their response (topic-types-inventory.md §5, footer-contract.md row 8).
 * It does not wait for the grade, and there is no Mark as Complete button anywhere in the journey.
 */
export function OraView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const ora = React.useMemo(() => (topic ? getOra(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useLmsStore((s) => s.oraState[topicId]);
  const oraSubmit = useLmsStore((s) => s.oraSubmit);
  // The store's grade action: the course team's assessment (`staffOverride` true), never a peer's.
  const oraReceiveGrade = useLmsStore((s) => s.oraReceivePeerReview);
  const markComplete = useLmsStore((s) => s.markComplete);
  const isCompleted = useLmsStore((s) => s.completedTopics.has(topicId));
  const showToast = useLmsStore((s) => s.showToast);

  // Submitted: the topic is complete, whatever the grade does next.
  const done = Boolean(ora) && Boolean(state?.submitted);
  React.useEffect(() => {
    if (done && !isCompleted) markComplete(topicId, { silent: true });
  }, [done, isCompleted, markComplete, topicId]);

  if (!topic || !ora) return null;

  const submitted = state?.submitted ?? false;
  const graded = typeof state?.score === "number";

  const step: OraStep = !submitted ? "response" : "grade";

  return (
    <div className="flex flex-col gap-8 py-6">
      <Stepper step={step} submitted={submitted} graded={graded} />

      {step === "response" ? (
        <ResponseStep
          ora={ora}
          onSubmit={(name) => {
            oraSubmit(topicId, name);
            showToast("Response submitted. The course team will grade it.");
          }}
        />
      ) : graded ? (
        <GradeStep ora={ora} score={state!.score!} />
      ) : (
        <WaitingStep onSimulate={() => oraReceiveGrade(topicId, 19, true)} />
      )}
    </div>
  );
}

/* ---- Stepper: where am I, and what unlocks next ---- */
function Stepper({ step, submitted, graded }: { step: OraStep; submitted: boolean; graded: boolean }) {
  // Two steps: no peer review on SkillUp courses (staff-graded, 28 Oct 2026).
  const steps: { id: OraStep; label: string; done: boolean }[] = [
    { id: "response", label: "Your response", done: submitted },
    { id: "grade", label: "Your grade", done: graded },
  ];

  return (
    // DS LMS/ICP/Topics/ORA-Stepper v1.2 (node 20328:3534): a single
    // horizontal segmented pill split by vertical dividers. Completed = green
    // check and label on bg/page, current = brand on bg/primary-soft,
    // upcoming = bg/faint. 26px circles; numbers body-medium/Bold (semibold
    // until .sk-text-body-medium-bold exists, CT-22). Below sm it is
    // Size=Compact: the current step keeps its label and takes the free width,
    // every other step shows only its circle.
    <ol className="flex overflow-hidden rounded-card border border-sko-border-subtle">
      {steps.map((s, i) => {
        const isCurrent = s.id === step;
        return (
          <li
            key={s.id}
            className={cn(
              "flex min-w-0 items-center gap-2 p-4 sm:flex-1",
              isCurrent ? "flex-1" : "max-sm:px-3",
              i > 0 && "border-l border-sko-border-subtle",
              isCurrent ? "bg-sko-bg-primary-soft" : s.done ? "bg-sko-bg-page" : "bg-sko-bg-faint",
            )}
          >
            <span
              className={cn(
                "inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-pill",
                s.done
                  ? "bg-sko-bg-success text-sko-icon-on-media"
                  : isCurrent
                    ? "bg-sko-bg-primary text-sko-text-on-primary"
                    : "bg-sko-bg-subtle text-sko-text-subtle",
              )}
            >
              {s.done ? <Icon icon={Check} size={16} /> : <span className="sk-text-body-medium-semibold">{i + 1}</span>}
            </span>
            <span
              className={cn(
                "truncate",
                !isCurrent && "max-sm:sr-only",
                s.done
                  ? "sk-text-body-medium-semibold text-sko-text-success"
                  : isCurrent
                    ? "sk-text-body-medium-semibold text-sko-text-primary"
                    : "sk-text-body-medium-medium text-sko-text-subtle",
              )}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Rubric({ ora }: { ora: OraContent }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="sk-text-label-small-medium text-sko-text-subtle">
        Rubric · {oraMaxPoints(ora)} points
      </span>
      <ul className="flex flex-col gap-1">
        {ora.criteria.map((c) => (
          <li key={c.id} className="flex items-baseline justify-between gap-3">
            <span className="sk-text-body-medium-regular text-sko-text-muted">{c.label}</span>
            <span className="sk-text-body-medium-medium shrink-0 text-sko-text-primary">
              {c.maxPoints} pts
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- Step 1 · Your response ---- */
function ResponseStep({ ora, onSubmit }: { ora: OraContent; onSubmit: (name: string) => void }) {
  const [file, setFile] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState("");
  const [confirming, setConfirming] = React.useState(false);
  const ready = Boolean(file) && description.trim().length > 0;

  return (
    <section className="flex flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5">
      {/* No due date: SkillUp sets none (decision 036). */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">Graded by the course team</Badge>
      </div>

      <p className="sk-text-body-large-regular text-sko-text-muted">{ora.brief}</p>
      <p className="sk-text-body-medium-regular text-sko-text-muted">{ora.deliverable}</p>

      <Rubric ora={ora} />

      <InlineAlert
        tone="info"
        title="Your mentor grades this response"
        description="A member of the course team assesses your work on the rubric above. Your grade is released once they have."
      />

      {/* Upload + the description edX requires per file. */}
      {file ? (
        <div className="flex flex-col gap-3">
          {/* DS LMS / ORA · Upload State=Uploaded (20328:3584): file row p 8/12,
              no icon, meta gap 2, trailing Replace. */}
          <div className="flex items-center gap-3 rounded-control bg-sko-bg-success-soft px-3 py-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              {/* DS body-medium/Bold — semibold until .sk-text-body-medium-bold exists (CT-22). */}
              <span className="sk-text-body-medium-semibold truncate text-sko-text-default">{file}</span>
              <span className="sk-text-body-small-regular text-sko-text-subtle">2.4 MB · uploaded</span>
            </div>
            {/* Hidden while the Submit Gate is open: files can't be replaced once confirming. */}
            {!confirming ? (
              <Button
                variant="secondary"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setFile(null);
                  setDescription("");
                  setConfirming(false);
                }}
              >
                Replace
              </Button>
            ) : null}
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="sk-text-body-small-medium uppercase text-sko-text-subtle">
              Description (required for each file)
            </span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Control plan with chart and response actions"
              className="sk-text-body-medium-regular rounded-control border border-sko-border-default bg-sko-bg-page px-3 py-2 text-sko-text-default outline-none transition-colors focus-visible:border-sko-border-primary"
            />
          </label>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setFile("Control_plan_NJ.pdf")}
          className="flex flex-col items-center gap-1.5 rounded-card border border-dashed border-sko-border-default bg-sko-bg-subtle px-5 py-6 transition-colors hover:border-sko-border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary"
        >
          {/* DS State=Empty (20328:3584): no icon; prompt body-medium/Bold
              (semibold until .sk-text-body-medium-bold exists, CT-22). */}
          <span className="sk-text-body-medium-semibold text-sko-text-primary">
            Drag &amp; drop or browse files
          </span>
          <span className="sk-text-body-small-regular text-sko-text-subtle">
            {ora.acceptedTypes.join(" ")} · max 500 MB total
          </span>
        </button>
      )}

      {confirming ? (
        // DS LMS / ORA · Submit Gate (20344:3359): p16, gap 8, r10, warning
        // fill + stroke, IRREVERSIBLE tag. Tag and title are Bold in the DS —
        // semibold until .sk-text-body-small-bold / .sk-text-body-large-bold exist (CT-22).
        // It rises into the place of the Submit button (short4, entrance only).
        <div className="sk-animate-rise sk-enter-only flex flex-col gap-2 rounded-card border border-sko-border-warning bg-sko-bg-warning-soft p-4">
          <span className="sk-text-body-small-semibold self-start rounded-control border border-sko-border-warning px-2 py-1 text-sko-text-warning">
            IRREVERSIBLE
          </span>
          <span className="sk-text-body-large-semibold text-sko-text-warning">
            Submit your response?
          </span>
          <p className="sk-text-body-medium-regular text-sko-text-warning">
            After you submit, you cannot edit or replace your files. Your submission goes to the
            course team for grading.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 max-md:[&>*]:flex-1">
            <Button variant="primary" size="md" onClick={() => onSubmit(file!)}>
              Yes, submit
            </Button>
            <Button variant="secondary" size="md" onClick={() => setConfirming(false)}>
              Keep editing
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="lg" disabled={!ready} onClick={() => setConfirming(true)}>
            Submit response
          </Button>
          {file && !ready ? (
            <span className="sk-text-body-small-regular text-sko-text-subtle">
              Add a description to continue.
            </span>
          ) : null}
        </div>
      )}
    </section>
  );
}

/* ---- Waiting: everything done, now it depends on the course team ---- */
function WaitingStep({ onSimulate }: { onSimulate: () => void }) {
  return (
    <section className="flex flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5">
      {/* DS LMS / ORA · Waiting Panel Kind=Awaiting grade (20328:3591): p24,
          gap 6, r10, no icon; title body-large/Bold (semibold until
          .sk-text-body-large-bold exists, CT-22). */}
      <div className="flex flex-col items-center gap-1.5 rounded-card bg-sko-bg-primary-soft p-6 text-center">
        <span className="sk-text-body-large-semibold text-sko-text-primary">
          Waiting for the course team
        </span>
        <span className="sk-text-body-medium-regular text-sko-text-primary">
          Your mentor grades your work on the rubric
        </span>
      </div>

      <InlineAlert
        tone="success"
        title="Your part is done"
        description="Response submitted. You'll get a notification when your grade is released."
      />

      <div className="flex flex-wrap gap-2 border-t border-sko-border-subtle pt-4">
        <Button variant="secondary" size="sm" onClick={onSimulate}>
          Simulate staff grade
        </Button>
      </div>
    </section>
  );
}

/* ---- Step 3 · Your grade ---- */
function GradeStep({ ora, score }: { ora: OraContent; score: number }) {
  const max = oraMaxPoints(ora);
  const pct = Math.round((score / max) * 100);
  // Per-criterion breakdown: the course team's score on each criterion of the rubric.
  const breakdown = ora.criteria.map((c, i) => ({
    label: c.label,
    got: i === 3 ? Math.max(0, c.maxPoints - (max - score)) : c.maxPoints,
    max: c.maxPoints,
  }));

  return (
    <section className="flex flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5">
      {/* DS LMS / ORA · Grade Panel Score (20328:3634): p20, gap 2, r10.
          Score is headline-medium/Bold — semibold until
          .sk-text-headline-medium-bold exists (CT-22). */}
      <div className="flex flex-col items-center gap-0.5 rounded-card bg-sko-bg-success-soft p-5">
        <span className="sk-text-headline-medium-semibold text-sko-text-success">
          {score} / {max}
        </span>
        <span className="sk-text-body-small-medium text-sko-text-success">
          {pct}% · graded by the course team
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="sk-text-body-small-medium uppercase text-sko-text-subtle">
          Breakdown · score per criterion
        </span>
        <ul className="flex flex-col gap-1.5">
          {breakdown.map((b) => (
            <li
              key={b.label}
              className="flex items-center justify-between gap-3 rounded-control bg-sko-bg-subtle px-3 py-2"
            >
              <span className="sk-text-body-medium-regular text-sko-text-default">{b.label}</span>
              <span
                className={cn(
                  // DS body-medium/Bold — semibold until .sk-text-body-medium-bold exists (CT-22).
                  "sk-text-body-medium-semibold shrink-0",
                  b.got === b.max ? "text-sko-text-success" : "text-sko-text-warning",
                )}
              >
                {b.got} / {b.max}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1 rounded-card bg-sko-bg-primary-soft p-4">
        <span className="sk-text-body-small-medium uppercase text-sko-text-primary">
          Feedback from the course team
        </span>
        <p className="sk-text-body-medium-regular text-sko-text-primary">
          “Clear chart and well-structured limits. The response plan could name an owner for each trigger.”
        </p>
      </div>
    </section>
  );
}

/* ---- An Open Response inside a Reading: text prompts, no files ---- */

/**
 * Figma Reading Row 6 (6014:5054, "Open Response · text only"; Nelson's SKO match review,
 * 28 Oct 2026), staff-graded as every SkillUp ORA: "Your turn", the two-step stepper, one text
 * response per prompt with Save draft, then Submit through the same Submit Gate. Once submitted
 * the answers read back and the page waits for the course team's grade. The Reading itself still
 * completes by hand (Mark as Complete in the feedback row).
 */
export function ReadingOpenResponseBlock({ topicId, openResponse }: { topicId: string; openResponse: ReadingOpenResponse }) {
  const state = useLmsStore((s) => s.oraState[topicId]);
  const oraSubmit = useLmsStore((s) => s.oraSubmit);
  const oraReceiveGrade = useLmsStore((s) => s.oraReceivePeerReview);
  const showToast = useLmsStore((s) => s.showToast);
  const [answers, setAnswers] = React.useState<string[]>(() => openResponse.prompts.map(() => ""));
  const [savedAt, setSavedAt] = React.useState<(string | null)[]>(() => openResponse.prompts.map(() => null));
  const [confirming, setConfirming] = React.useState(false);
  const submitted = state?.submitted ?? false;
  const graded = typeof state?.score === "number";
  const ready = answers.every((a) => a.trim().length > 0);
  const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="sk-text-title-large-bold text-sko-text-default">Your turn</h2>
      <p className="sk-text-body-large-regular max-w-text text-pretty text-sko-text-muted">{openResponse.intro}</p>

      <Stepper step={submitted ? "grade" : "response"} submitted={submitted} graded={graded} />

      {openResponse.prompts.map((prompt, i) => (
        <label key={prompt} className="flex flex-col gap-1.5">
          <span className="sk-text-body-medium-regular text-sko-text-muted">
            {i + 1} · {prompt}
          </span>
          <span className="sk-text-body-medium-medium text-sko-text-default">
            Your response<span className="text-sko-text-error" aria-hidden>*</span>
          </span>
          <textarea
            value={answers[i]}
            readOnly={submitted}
            required
            rows={4}
            onChange={(e) => {
              const text = e.target.value;
              setAnswers((prev) => prev.map((a, j) => (j === i ? text : a)));
            }}
            placeholder="Write your response here…"
            className="sk-text-body-large-regular w-full resize-y rounded-control border border-sko-border-default bg-sko-bg-page px-3 py-2 text-sko-text-default outline-none transition-colors placeholder:text-sko-text-placeholder focus:border-sko-border-primary read-only:bg-sko-bg-subtle"
          />
          {!submitted ? (
            <span className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const at = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                  setSavedAt((prev) => prev.map((s, j) => (j === i ? at : s)));
                }}
              >
                Save draft
              </Button>
              {savedAt[i] ? (
                <span role="status" className="sk-text-body-small-regular text-sko-text-subtle">
                  Draft saved at {savedAt[i]} · {words(answers[i])} words
                </span>
              ) : null}
            </span>
          ) : null}
        </label>
      ))}

      {submitted ? (
        graded ? (
          <InlineAlert
            tone="success"
            title={`Graded · ${state!.score} points out of 20`}
            description="The course team graded your responses on the rubric. Your score is in the Progress tab."
          />
        ) : (
          <>
            <InlineAlert
              tone="info"
              title="Waiting for the course team"
              description="Responses submitted. You'll get a notification when your grade is released."
            />
            <div>
              <Button variant="secondary" size="sm" onClick={() => oraReceiveGrade(topicId, 17, true)}>
                Simulate staff grade
              </Button>
            </div>
          </>
        )
      ) : confirming ? (
        <div className="sk-animate-rise sk-enter-only flex flex-col gap-2 rounded-card border border-sko-border-warning bg-sko-bg-warning-soft p-4">
          <span className="sk-text-body-small-semibold self-start rounded-control border border-sko-border-warning px-2 py-1 text-sko-text-warning">
            IRREVERSIBLE
          </span>
          <span className="sk-text-body-large-semibold text-sko-text-warning">Submit your responses?</span>
          <p className="sk-text-body-medium-regular text-sko-text-warning">
            After you submit, you cannot edit your answers. They go to the course team for grading.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 max-md:[&>*]:flex-1">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                oraSubmit(topicId, "Text response");
                setConfirming(false);
                showToast("Responses submitted. The course team will grade them.");
              }}
            >
              Yes, submit
            </Button>
            <Button variant="secondary" size="md" onClick={() => setConfirming(false)}>
              Keep editing
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md" disabled={!ready} onClick={() => setConfirming(true)}>
            Submit
          </Button>
          {!ready ? (
            <span className="sk-text-body-small-regular text-sko-text-subtle">Answer both prompts to submit.</span>
          ) : null}
        </div>
      )}
    </section>
  );
}
