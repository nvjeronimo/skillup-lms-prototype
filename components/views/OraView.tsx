"use client";

import * as React from "react";
import { Check, FileText, ShieldCheck } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { OptionRadio } from "@/components/views/LessonBlocks";
import { getOra, oraMaxPoints, type OraContent, type OraStep } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * ORA — the only topic type the learner returns to over days or weeks.
 * Steps: Response → Review a peer → Your grade. The waiting and empty states
 * carry as much weight as the forms: the learner has done everything and now
 * depends on other people, so the UI has to show progress, not a spinner.
 */
export function OraView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const ora = React.useMemo(() => (topic ? getOra(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useLmsStore((s) => s.oraState[topicId]);
  const oraSubmit = useLmsStore((s) => s.oraSubmit);
  const oraGivePeerReview = useLmsStore((s) => s.oraGivePeerReview);
  const oraReceivePeerReview = useLmsStore((s) => s.oraReceivePeerReview);
  const markComplete = useLmsStore((s) => s.markComplete);
  const showToast = useLmsStore((s) => s.showToast);

  if (!topic || !ora) return null;

  const submitted = state?.submitted ?? false;
  const reviewsGiven = state?.reviewsGiven ?? 0;
  const reviewsReceived = state?.reviewsReceived ?? 0;
  const quotaMet = reviewsGiven >= ora.requiredReviews;
  const graded = typeof state?.score === "number";

  const step: OraStep = !submitted ? "response" : !quotaMet ? "peer" : "grade";

  return (
    <div className="flex flex-col gap-5 py-4">
      <Stepper step={step} submitted={submitted} quotaMet={quotaMet} graded={graded} />

      {step === "response" ? (
        <ResponseStep
          ora={ora}
          onSubmit={(name) => {
            oraSubmit(topicId, name);
            showToast("Response submitted. Now review a peer.");
          }}
        />
      ) : step === "peer" ? (
        <PeerStep
          ora={ora}
          reviewsGiven={reviewsGiven}
          onSubmitReview={() => {
            oraGivePeerReview(topicId);
            showToast("Review submitted. Thanks, that unlocks your own grade.");
          }}
        />
      ) : graded ? (
        <GradeStep
          ora={ora}
          score={state!.score!}
          staffOverride={state?.staffOverride}
          onContinue={() => markComplete(topicId)}
        />
      ) : (
        <WaitingStep
          reviewsReceived={reviewsReceived}
          onSimulate={(staff) =>
            oraReceivePeerReview(topicId, staff ? 19 : 17, staff)
          }
        />
      )}
    </div>
  );
}

/* ---- Stepper: where am I, and what unlocks next ---- */
function Stepper({
  step,
  submitted,
  quotaMet,
  graded,
}: {
  step: OraStep;
  submitted: boolean;
  quotaMet: boolean;
  graded: boolean;
}) {
  const steps: { id: OraStep; label: string; done: boolean }[] = [
    { id: "response", label: "Your response", done: submitted },
    { id: "peer", label: "Review a peer", done: quotaMet },
    { id: "grade", label: "Your grade", done: graded },
  ];

  return (
    // DS LMS / ORA · Stepper (node 20328:3534), Size=Default: a single
    // horizontal segmented pill — three equal-width segments split by vertical
    // dividers, each tinted by its state. Completed = green, current = brand,
    // upcoming = bg/faint. 26px circles; numbers body-medium/Bold (semibold
    // until .sk-text-sm-bold exists, CT-22).
    <ol className="flex overflow-hidden rounded-xl border border-sko-border-subtle">
      {steps.map((s, i) => {
        const isCurrent = s.id === step;
        return (
          <li
            key={s.id}
            className={cn(
              "flex flex-1 min-w-0 items-center gap-2 p-4",
              i > 0 && "border-l border-sko-border-subtle",
              isCurrent ? "bg-sko-bg-primary-soft" : s.done ? "bg-sko-bg-success-soft" : "bg-sko-bg-faint",
            )}
          >
            <span
              className={cn(
                "inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full",
                s.done
                  ? "bg-sko-bg-success text-sko-icon-on-media"
                  : isCurrent
                    ? "bg-sko-bg-primary text-sko-text-on-primary"
                    : "bg-sko-bg-subtle text-sko-text-subtle",
              )}
            >
              {s.done ? <Icon icon={Check} size={16} /> : <span className="sk-text-sm-semibold">{i + 1}</span>}
            </span>
            <span
              className={cn(
                "truncate",
                s.done
                  ? "sk-text-sm-semibold text-sko-text-success"
                  : isCurrent
                    ? "sk-text-sm-semibold text-sko-text-primary"
                    : "sk-text-sm-medium text-sko-text-subtle",
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
      <span className="sk-text-2xs-medium text-sko-text-subtle">
        Rubric · {oraMaxPoints(ora)} points
      </span>
      <ul className="flex flex-col gap-1">
        {ora.criteria.map((c) => (
          <li key={c.id} className="flex items-baseline justify-between gap-3">
            <span className="sk-text-sm-regular text-sko-text-muted">{c.label}</span>
            <span className="sk-text-sm-medium shrink-0 text-sko-text-primary">
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
    <section className="flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">Peer-reviewed project</Badge>
        <Badge tone="neutral">{ora.dueLabel}</Badge>
      </div>

      <p className="sk-text-md-regular text-sko-text-muted">{ora.brief}</p>
      <p className="sk-text-sm-regular text-sko-text-muted">{ora.deliverable}</p>

      <Rubric ora={ora} />

      <InlineAlert
        tone="info"
        title={`You will also review ${ora.requiredReviews} peer`}
        description="Your own grade is released once you've reviewed a peer and a peer has reviewed you."
      />

      {/* Upload + the description edX requires per file. */}
      {file ? (
        <div className="flex flex-col gap-3">
          {/* DS LMS / ORA · Upload State=Uploaded (20328:3584): file row p 8/12,
              no icon, meta gap 2, trailing Replace. */}
          <div className="flex items-center gap-3 rounded-lg bg-sko-bg-success-soft px-3 py-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              {/* DS body-medium/Bold — semibold until .sk-text-sm-bold exists (CT-22). */}
              <span className="sk-text-sm-semibold truncate text-sko-text-default">{file}</span>
              <span className="sk-text-xs-regular text-sko-text-subtle">2.4 MB · uploaded</span>
            </div>
            <Button variant="secondary" size="sm" className="ml-auto" onClick={() => setFile(null)}>
              Replace
            </Button>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="sk-text-xs-medium uppercase text-sko-text-subtle">
              Description (required for each file)
            </span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Control plan with chart and response actions"
              className="sk-text-sm-regular rounded-lg border border-sko-border-default bg-sko-bg-page px-3 py-2 text-sko-text-default outline-none focus-visible:border-sko-border-primary"
            />
          </label>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setFile("Control_plan_NJ.pdf")}
          className="flex flex-col items-center gap-1.5 rounded-[10px] border border-dashed border-sko-border-default bg-sko-bg-subtle px-5 py-6 transition-colors hover:border-sko-border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary"
        >
          {/* DS State=Empty (20328:3584): no icon; prompt body-medium/Bold
              (semibold until .sk-text-sm-bold exists, CT-22). */}
          <span className="sk-text-sm-semibold text-sko-text-primary">
            Drag &amp; drop or browse files
          </span>
          <span className="sk-text-xs-regular text-sko-text-subtle">
            {ora.acceptedTypes.join(" ")} · max 500 MB total
          </span>
        </button>
      )}

      {confirming ? (
        // DS LMS / ORA · Submit Gate (20344:3359): p16, gap 8, r10, warning
        // fill + stroke, IRREVERSIBLE tag. Tag and title are Bold in the DS —
        // semibold until .sk-text-xs-bold / .sk-text-md-bold exist (CT-22).
        <div className="flex flex-col gap-2 rounded-[10px] border border-sko-border-warning bg-sko-bg-warning-soft p-4">
          <span className="sk-text-xs-semibold self-start rounded-md border border-sko-border-warning px-2 py-1 text-sko-text-warning">
            IRREVERSIBLE
          </span>
          <span className="sk-text-md-semibold text-sko-text-warning">
            Submit your response?
          </span>
          <p className="sk-text-sm-regular text-sko-text-warning">
            After you submit, you cannot edit or replace your files. Your submission goes to a peer
            for review.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
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
            <span className="sk-text-xs-regular text-sko-text-subtle">
              Add a description to continue.
            </span>
          ) : null}
        </div>
      )}
    </section>
  );
}

/* ---- Step 2 · Review a peer (includes the empty state) ---- */
function PeerStep({
  ora,
  reviewsGiven,
  onSubmitReview,
}: {
  ora: OraContent;
  reviewsGiven: number;
  onSubmitReview: () => void;
}) {
  // The empty state is the most common one in a small cohort and the most
  // often forgotten — it must not look like a failure.
  const [hasPeer, setHasPeer] = React.useState(false);
  const [scores, setScores] = React.useState<Record<string, number>>({});
  const [comment, setComment] = React.useState("");
  const allScored = ora.criteria.every((c) => typeof scores[c.id] === "number");
  const ready = allScored && comment.trim().length > 0;

  if (!hasPeer) {
    return (
      <section className="flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5">
        {/* DS LMS / ORA · Waiting Panel Kind=No peers yet (20328:3591): p24,
            gap 6, r10, no icon; title body-large/Bold (semibold until
            .sk-text-md-bold exists, CT-22). */}
        <div className="flex flex-col items-center gap-1.5 rounded-[10px] bg-sko-bg-subtle p-6 text-center">
          <span className="sk-text-md-semibold text-sko-text-default">
            No submissions to review yet
          </span>
          <p className="sk-text-sm-regular max-w-md text-sko-text-muted">
            Nobody in your cohort has submitted work that needs reviewing right now. Check back
            later. We&rsquo;ll email you when one is available.
          </p>
        </div>

        <InlineAlert
          tone="success"
          title="Your submission is safe"
          description="Your response is in. Next, your peers review it."
        />

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setHasPeer(true)}>
            A submission is available
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="sk-text-2xs-medium text-sko-text-primary">
          {/* "Review 1 of 1" is noise — only show the count when there are several. */}
          {ora.requiredReviews > 1
            ? `Review ${reviewsGiven + 1} of ${ora.requiredReviews}`
            : "Review a peer's submission"}
        </span>
        <span className="sk-text-xs-regular text-sko-text-subtle">Anonymous peer</span>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-sko-bg-subtle px-3 py-2.5">
        <Icon icon={FileText} size={16} className="text-sko-text-primary" />
        <div className="flex min-w-0 flex-col">
          <span className="sk-text-sm-semibold truncate text-sko-text-default">
            Control_plan_submission.pdf
          </span>
          <span className="sk-text-xs-regular text-sko-text-subtle">
            &ldquo;Control plan for the invoicing process&rdquo;
          </span>
        </div>
        <Button variant="secondary" size="sm" className="ml-auto">
          Open
        </Button>
      </div>

      <span className="sk-text-2xs-medium text-sko-text-primary">
        Score against the rubric
      </span>

      <div className="flex flex-col gap-3">
        {ora.criteria.map((c) => (
          // DS LMS / ORA · Rubric Criterion (20328:3563): p12, gap 8, r10,
          // border/subtle, title inside the box (body-medium/Bold — semibold
          // until .sk-text-sm-bold exists, CT-22). Options are Quiz · Option
          // Rows; Scored = State=Selected (bg/primary-soft, checked radio).
          // The floated legend is laid out inside the fieldset, not on its border.
          <fieldset
            key={c.id}
            className="flex flex-col gap-2 rounded-[10px] border border-sko-border-subtle p-3"
          >
            <legend className="sk-text-sm-semibold float-left w-full text-sko-text-default">
              {c.label}
            </legend>
            {c.options.map((o) => {
              const selected = scores[c.id] === o.points;
              return (
                <button
                  key={o.points}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setScores((s) => ({ ...s, [c.id]: o.points }))}
                  className={cn(
                    "sk-text-sm-regular flex items-center gap-3 rounded-lg border border-sko-border-subtle py-3 pl-3 pr-4 text-left text-sko-text-default transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary",
                    selected ? "bg-sko-bg-primary-soft" : "bg-sko-bg-page hover:bg-sko-bg-subtle",
                  )}
                >
                  <OptionRadio checked={selected} />
                  {/* The DS row has no points chip — the points ride in the label. */}
                  <span className="flex-1">
                    {o.label} · {o.points} pts
                  </span>
                </button>
              );
            })}
          </fieldset>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="sk-text-2xs-medium text-sko-text-subtle">
          {ora.overallCommentPrompt} (required)
        </span>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share one specific thing that worked well…"
          className="sk-text-sm-regular rounded-lg border border-sko-border-default bg-sko-bg-page px-3 py-2.5 text-sko-text-default outline-none focus-visible:border-sko-border-primary"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" disabled={!ready} onClick={onSubmitReview}>
          Submit review
        </Button>
        <span className="sk-text-xs-regular text-sko-text-subtle">
          {Object.keys(scores).length} of {ora.criteria.length} criteria scored
        </span>
      </div>
    </section>
  );
}

/* ---- Waiting: everything done, now it depends on other people ---- */
function WaitingStep({
  reviewsReceived,
  onSimulate,
}: {
  reviewsReceived: number;
  onSimulate: (staff: boolean) => void;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5">
      {/* DS LMS / ORA · Waiting Panel Kind=Awaiting grade (20328:3591): p24,
          gap 6, r10, no icon; title body-large/Bold (semibold until
          .sk-text-md-bold exists, CT-22). */}
      <div className="flex flex-col items-center gap-1.5 rounded-[10px] bg-sko-bg-primary-soft p-6 text-center">
        <span className="sk-text-md-semibold text-sko-text-primary">
          Waiting for peer assessment
        </span>
        <span className="sk-text-sm-regular text-sko-text-primary">
          {reviewsReceived} of 1 peers have reviewed your work
        </span>
      </div>

      <InlineAlert
        tone="success"
        title="Your part is done"
        description="Response submitted · peer review completed. We'll email you when your grade is released."
      />

      <p className="sk-text-xs-regular text-sko-text-subtle">
        If peers are slow, the requirement relaxes automatically after 7 days, so your grade is never
        blocked indefinitely.
      </p>

      <div className="flex flex-wrap gap-2 border-t border-sko-border-subtle pt-4">
        <Button variant="secondary" size="sm" onClick={() => onSimulate(false)}>
          Simulate peer grade
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onSimulate(true)}>
          Simulate staff regrade
        </Button>
      </div>
    </section>
  );
}

/* ---- Step 3 · Your grade ---- */
function GradeStep({
  ora,
  score,
  staffOverride,
  onContinue,
}: {
  ora: OraContent;
  score: number;
  staffOverride?: boolean;
  onContinue: () => void;
}) {
  const max = oraMaxPoints(ora);
  const pct = Math.round((score / max) * 100);
  // Per-criterion breakdown — edX shows the median of the peer scores.
  const breakdown = ora.criteria.map((c, i) => ({
    label: c.label,
    got: i === 3 ? Math.max(0, c.maxPoints - (max - score)) : c.maxPoints,
    max: c.maxPoints,
  }));

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-5">
      {/* DS LMS / ORA · Grade Panel Score (20328:3634): p20, gap 2, r10.
          Score is headline-medium/Bold — semibold until
          .sk-text-display-sm-bold exists (CT-22). */}
      <div className="flex flex-col items-center gap-0.5 rounded-[10px] bg-sko-bg-success-soft p-5">
        <span className="sk-text-display-sm-semibold text-sko-text-success">
          {score} / {max}
        </span>
        <span className="sk-text-xs-medium text-sko-text-success">
          {pct}% · {staffOverride ? "graded by the course team" : "peer-assessed"}
        </span>
      </div>

      {staffOverride ? (
        <InlineAlert
          tone="warning"
          title="This grade replaced the peer score"
          description="A member of the course team reviewed your submission. Staff assessment always takes precedence over peer grading."
        />
      ) : null}

      <div className="flex flex-col gap-1.5">
        <span className="sk-text-xs-medium uppercase text-sko-text-subtle">
          Breakdown · median score per criterion
        </span>
        <ul className="flex flex-col gap-1.5">
          {breakdown.map((b) => (
            <li
              key={b.label}
              className="flex items-center justify-between gap-3 rounded-md bg-sko-bg-subtle px-3 py-2"
            >
              <span className="sk-text-sm-regular text-sko-text-default">{b.label}</span>
              <span
                className={cn(
                  // DS body-medium/Bold — semibold until .sk-text-sm-bold exists (CT-22).
                  "sk-text-sm-semibold shrink-0",
                  b.got === b.max ? "text-sko-text-success" : "text-sko-text-warning",
                )}
              >
                {b.got} / {b.max}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1 rounded-[10px] bg-sko-bg-primary-soft p-4">
        <span className="sk-text-xs-medium uppercase text-sko-text-primary">
          {staffOverride ? "Feedback from the course team" : "Feedback from your peer"}
        </span>
        <p className="sk-text-sm-regular text-sko-text-primary">
          {staffOverride
            ? "“Your response plan was stronger than the peer score reflected. Ownership was clearly assigned. Score adjusted.”"
            : "“Clear chart and well-structured limits. The response plan could name an owner for each trigger.”"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" leftIcon={ShieldCheck} onClick={onContinue}>
          Mark as complete
        </Button>
      </div>
    </section>
  );
}
