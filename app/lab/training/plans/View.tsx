"use client";

import { DemoAction } from "@/components/lab/training/DemoAction";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Download, Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MockTag } from "@/components/lab/MockTag";
import { MOCK, type Enrolment } from "@/lib/lab/dashboard-mock";
import { getPlan, type TrainingPlan } from "@/lib/lab/training-plan";
import { cn } from "@/lib/utils";
import { PlanSection, WEEKS, WeekLegend, WeekStrip, daysAway, nextSession, planWeek } from "./parts";

/** A printed sheet of plan rows, hairline between rows only (the sheet draws its own edge). */
const SHEET = "tb-sheet mt-4 [&>li+li]:border-t [&>li+li]:border-[color:var(--tb-rule)]";

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** Plans: every enrolment as a plan in the learner's season — followed, waiting, locked or finished. */
export function TrainingPlans() {
  const params = useSearchParams();
  const plan = getPlan(params.get("persona"));
  const q = `?persona=${plan.persona.id}`;
  const all = plan.persona.enrolments;

  const inProgress = all.filter((e) => e.status === "in-progress");
  const notStarted = all.filter((e) => e.status === "not-started");
  const locked = all.filter((e) => e.status === "locked");
  const finished = all.filter((e) => e.status === "completed");
  const certificates = all.filter((e) => e.cert === "downloadable" || e.cert === "generating").length;

  const season = [
    { n: inProgress.length, word: "in progress" },
    { n: notStarted.length, word: "ready to start" },
    { n: finished.length, word: "finished" },
    { n: certificates, word: plural(certificates, "certificate", "certificates") },
    // A season with nothing done yet shouldn't open on a row of zeros: show only what exists.
  ].filter((s) => s.n > 0);

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-8 outline-none md:px-8 md:pt-12">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-4">
          <h1 className="tb-h1">Plans</h1>
          <p className="tb-body-s tb-c-ink2 mt-2">Your autumn season</p>
        </div>
        <section aria-label="Your season so far" className="lg:col-span-8">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8 lg:justify-end">
            {season.map((s) => (
              <li key={s.word} className="flex items-baseline gap-2">
                <span className={cn("tb-num tb-num-l tb-slot", s.n === 0 && "tb-c-ink3")}>{s.n}</span>
                <span className="tb-body tb-c-ink2">{s.word}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {inProgress.length > 0 ? (
        <PlanSection id="progress-h" title="In progress" count={inProgress.length} aside={<WeekLegend />}>
          <ul className={SHEET}>
            {inProgress.map((e) => (
              <InProgressRow key={e.id} e={e} plan={plan} q={q} />
            ))}
          </ul>
          <div className="mt-3">
            <MockTag reason={`12-week plan, session days and pace — ${MOCK.pace}. Weeks derived from completion %.`} />
          </div>
        </PlanSection>
      ) : null}

      {notStarted.length > 0 ? (
        <PlanSection id="start-h" title="Ready to start" count={notStarted.length}>
          <p className="tb-body tb-c-ink2 mt-2 max-w-[68ch]">
            {notStarted.length === 1 ? "This plan starts" : "These plans start"} the day you do. Nothing is late and nothing has been missed.
          </p>
          <ul className={SHEET}>
            {notStarted.map((e) => (
              <NotStartedRow key={e.id} e={e} plan={plan} q={q} />
            ))}
          </ul>
          <div className="mt-3">
            <MockTag reason={`12-week plan length — ${MOCK.pace}`} />
          </div>
        </PlanSection>
      ) : null}

      {locked.length > 0 ? (
        <PlanSection id="locked-h" title="Opens later" count={locked.length}>
          <ul className={SHEET}>
            {locked.map((e) => (
              <li key={e.id} className="grid gap-x-8 gap-y-2 px-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-6">
                <div className="min-w-0">
                  <h3 className="tb-title">{e.title}</h3>
                  <p className="tb-body-s tb-c-ink2 mt-1 flex items-start gap-2">
                    <Icon icon={Lock} size={16} aria-hidden="true" className="mt-0.5 flex-none" />
                    <span>
                      <span className="sr-only">Locked. </span>
                      Opens when you finish <span className="tb-strong tb-c-ink">{e.lockedBy ?? "the plan before it"}</span>.
                    </span>
                  </p>
                </div>
                <p className="tb-meta tb-c-ink2">
                  <span className="tb-num tb-num-m tb-c-ink">{e.topicsTotal}</span> topics waiting
                </p>
              </li>
            ))}
          </ul>
        </PlanSection>
      ) : null}

      {finished.length > 0 ? (
        <PlanSection id="results-h" title="Results" count={finished.length}>
          <ul className={SHEET}>
            {finished.map((e) => (
              <ResultRow key={e.id} e={e} />
            ))}
          </ul>
        </PlanSection>
      ) : null}

      {all.length === 0 ? (
        <p className="tb-body tb-c-ink2 mt-12">No plans yet. When you enrol in a course, its plan appears here.</p>
      ) : null}
    </main>
  );
}

function InProgressRow({ e, plan, q }: { e: Enrolment; plan: TrainingPlan; q: string }) {
  const week = planWeek(e, plan);
  const next = nextSession(e, plan);
  const away = daysAway(e.lastActive);
  const isCohortCourse = e.id === "six-sigma";
  const replanned = isCohortCourse && plan.replan;
  const href = isCohortCourse ? `/lab/training/course/six-sigma${q}` : "#";

  return (
    <li className="grid gap-x-10 gap-y-5 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0">
        <h3 className="tb-title">{e.title}</h3>
        {isCohortCourse ? <p className="tb-body-s tb-c-teal tb-strong mt-1">{plan.status.word}</p> : null}

        <p className="tb-body-s tb-c-ink2 mt-2">
          {next ? (
            <>
              <span className="tb-label mr-1">Next</span>{" "}
              <span className={cn("tb-mark mr-1.5 align-middle", next.state === "today" ? "tb-mark-today" : next.state === "moved" ? "tb-mark-plan tb-mark-moved" : "tb-mark-plan")} aria-hidden />
              <span className="tb-c-ink">{next.day}</span>
              {next.state === "moved" ? <span className="sr-only"> (moved here by your re-plan)</span> : null}
              {" · "}
              <span className="tb-strong tb-c-ink">{next.title}</span> · {next.kind} ·{" "}
              <span className="whitespace-nowrap">
                <span className="tb-num">{next.minutes}</span> min
              </span>
            </>
          ) : e.nextTopic ? (
            <>
              <span className="tb-label mr-1">Next</span> <span className="tb-strong tb-c-ink">{e.nextTopic.title}</span> · {e.nextTopic.type}
            </>
          ) : null}
        </p>

        {replanned ? (
          <p className="tb-body-s tb-c-ink2 mt-2">
            <span className="tb-mark tb-mark-plan tb-mark-moved mr-2 align-middle" aria-hidden />
            Last visit {e.lastActive}. {plan.status.line}
          </p>
        ) : away >= 7 ? (
          <p className="tb-body-s tb-c-ink2 mt-2">
            Last visit {e.lastActive}. The plan kept your place.
          </p>
        ) : null}

        {href !== "#" ? (
          <Link href={href} className="tb-link mt-1 gap-1.5">
            Open the plan<span className="sr-only">: {e.title}</span> <Icon icon={ArrowRight} size={16} aria-hidden="true" />
          </Link>
        ) : (
          <DemoAction className="tb-link mt-1 gap-1.5">
            Open the plan<span className="sr-only">: {e.title}</span> <Icon icon={ArrowRight} size={16} aria-hidden="true" />
          </DemoAction>
        )}
      </div>

      <div className="flex min-w-0 items-end gap-4 lg:pt-1">
        <div className="min-w-0 flex-1">
          <p className="tb-meta tb-c-ink2 mb-2">
            <span className="tb-num tb-num-m tb-c-ink">Week {week}</span> of {WEEKS}
            <span className="sr-only">
              {" "}— {week - 1} {plural(week - 1, "week", "weeks")} done, {WEEKS - week} still to come
            </span>
          </p>
          <WeekStrip week={week} />
        </div>
        <div
          role="progressbar"
          aria-label={`${e.title} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={e.pct}
          aria-valuetext={`${e.pct}% — ${e.topicsDone} of ${e.topicsTotal} topics`}
          className="w-[5.5rem] flex-none text-right"
        >
          <p className="tb-num tb-num-l">
            {e.pct}
            <span className="tb-num-m">%</span>
          </p>
          <p className="tb-meta tb-c-ink2 mt-1">
            <span className="tb-num tb-c-ink">{e.topicsDone}</span>/<span className="tb-num">{e.topicsTotal}</span> topics
          </p>
        </div>
      </div>
    </li>
  );
}

function NotStartedRow({ e, plan, q }: { e: Enrolment; plan: TrainingPlan; q: string }) {
  const next = nextSession(e, plan);
  const first = next ? { title: next.title, type: next.kind, minutes: next.minutes as number | undefined } : e.nextTopic ? { title: e.nextTopic.title, type: e.nextTopic.type, minutes: undefined } : undefined;
  const href = e.id === "six-sigma" ? `/lab/training/course/six-sigma${q}` : "#";

  return (
    <li className="grid gap-x-10 gap-y-5 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0">
        <h3 className="tb-title">{e.title}</h3>
        <p className="tb-body-s tb-c-ink2 mt-2">Starts when you do.</p>
        {first ? (
          <p className="tb-body-s tb-c-ink2 mt-1">
            <span className="tb-label mr-1">First</span> <span className="tb-strong tb-c-ink">{first.title}</span> · {first.type}
            {first.minutes ? (
              <>
                {" · "}
                <span className="tb-num">{first.minutes}</span> min
              </>
            ) : null}
          </p>
        ) : null}
        {href !== "#" ? (
          <Link href={href} className="tb-btn tb-btn-quiet mt-4">
            Start<span className="sr-only"> {e.title}</span>
          </Link>
        ) : (
          <DemoAction className="tb-btn tb-btn-quiet mt-4">
            Start<span className="sr-only"> {e.title}</span>
          </DemoAction>
        )}
      </div>

      <div className="min-w-0 lg:pt-1">
        <p className="tb-meta tb-c-ink2 mb-2">
          <span className="tb-num tb-num-m tb-c-ink">{WEEKS} weeks</span> · <span className="tb-num">{e.topicsTotal}</span> topics
          <span className="sr-only"> — a {WEEKS}-week plan, not started</span>
        </p>
        <WeekStrip week={0} />
      </div>
    </li>
  );
}

function ResultRow({ e }: { e: Enrolment }) {
  const last = e.lastActive.charAt(0).toLowerCase() + e.lastActive.slice(1);
  return (
    <li className="grid gap-x-8 gap-y-3 px-4 py-5 md:grid-cols-[minmax(0,1fr)_7.5rem_minmax(0,15rem)] md:items-center md:px-6">
      <div className="min-w-0">
        <h3 className="tb-title">{e.title}</h3>
        <p className="tb-meta tb-c-ink2 mt-1 flex items-center gap-1.5">
          <span className="tb-mark tb-mark-done" aria-hidden />
          Finished · last visit {last}
        </p>
      </div>
      <p className="tb-meta tb-c-ink2">
        <span className="tb-num tb-num-m tb-c-ink">
          {e.topicsDone}/{e.topicsTotal}
        </span>{" "}
        topics
      </p>
      <div className="md:justify-self-end md:text-right">
        <CertificateState e={e} />
      </div>
    </li>
  );
}

function CertificateState({ e }: { e: Enrolment }) {
  switch (e.cert) {
    case "downloadable":
      return (
        <DemoAction className="tb-btn tb-btn-quiet">
          <Icon icon={Download} size={18} aria-hidden="true" />
          Download certificate<span className="sr-only">: {e.title}</span>
        </DemoAction>
      );
    case "generating":
      return (
        <p className="tb-body-s">
          <span className="tb-strong">Certificate being prepared</span>
          <span className="tb-meta tb-c-ink2 block">It appears here when it is ready.</span>
        </p>
      );
    case "audit_passing":
      return (
        <p className="tb-body-s">
          <span className="tb-strong">Passed</span>
          <span className="tb-meta tb-c-ink2 block">Audit track · no certificate on this track</span>
        </p>
      );
    default:
      return (
        <p className="tb-body-s">
          <span className="tb-strong">No certificate yet</span>
          <span className="tb-meta tb-c-ink2 block">A passing grade on the graded work earns it.</span>
        </p>
      );
  }
}
