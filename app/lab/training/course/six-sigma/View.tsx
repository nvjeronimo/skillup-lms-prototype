"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MockTag } from "@/components/lab/MockTag";
import { course } from "@/lib/data";
import { MOCK } from "@/lib/lab/dashboard-mock";
import { getPlan } from "@/lib/lab/training-plan";
import { cn } from "@/lib/utils";
import { formatMinutes, getCoursePlan, pad } from "./plan-model";
import { PlanTable } from "./PlanTable";
import { RaceDay } from "./RaceDay";
import { AroundThisPlan } from "./AroundThisPlan";

/** "The Training Block" — the Six Sigma course as a periodised 12-week plan. */
export function CoursePlan() {
  const params = useSearchParams();
  const plan = getPlan(params.get("persona"));
  const persona = plan.persona;
  const model = getCoursePlan(persona.id);
  const enrolment = persona.enrolments.find((e) => e.id === "six-sigma");
  const started = model.done > 0;
  const q = `?persona=${persona.id}`;
  const next = model.next;
  const thisWeek = started ? plan.weekIndex : 0;

  const statusLine = started
    ? `Week ${plan.weekIndex} of ${plan.weeksTotal} · ${plan.status.word}`
    : `Not started · a ${plan.weeksTotal}-week plan that starts the day you do`;

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-6 outline-none md:px-8 md:pt-10">
      <Link href={`/lab/training/plans${q}`} className="tb-link tb-body-s gap-1.5">
        <Icon icon={ArrowLeft} size={16} aria-hidden="true" />
        All plans
      </Link>

      {/* ---------- header: the course, where you are in the block, the one next thing ---------- */}
      <header className="mt-4 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h1 className="tb-h1 text-balance">{course.title}</h1>
          <p className="tb-body-s tb-c-ink2 mt-3">
            {course.provider} · {course.courseType} · {course.difficulty} · {course.deliveryMode}
          </p>
          <p className="tb-body mt-4">
            <span className="tb-strong">{statusLine}</span>
            <span className="tb-c-ink2">
              {" · "}
              {started ? (
                <>
                  <span className="tb-num tb-c-ink">{model.done}</span> of {model.total} topics done ·{" "}
                  <span className="tb-num tb-c-ink">{formatMinutes(model.minutesLeft)}</span> left
                </>
              ) : (
                <>
                  <span className="tb-num tb-c-ink">{model.total}</span> topics ·{" "}
                  <span className="tb-num tb-c-ink">{formatMinutes(model.minutesTotal)}</span> in all
                </>
              )}
            </span>
          </p>
          <p className="tb-meta tb-c-ink3 mt-1">
            Time adds up the durations the course gives; {model.topics.filter((t) => t.minutes == null).length} topics have none yet.
          </p>
          {plan.status.tone === "replanned" && model.moved.length ? (
            <p className="tb-body-s tb-c-ink2 mt-2 flex items-start gap-2">
              <span className="tb-mark tb-mark-plan tb-mark-moved mt-1" aria-hidden />
              Re-planned after your break: {model.moved.length} topics moved a week later. Nothing dropped, and race day holds.
            </p>
          ) : plan.status.tone === "ahead" ? (
            <p className="tb-body-s tb-c-ink2 mt-2">Week {plan.weekIndex} is done early — today&apos;s topic comes from week {next ? pad(next.week) : ""}.</p>
          ) : null}
          <div className="mt-3">
            <MockTag reason={`Plan weeks, status and race day — ${MOCK.pace}; ${MOCK.due}`} />
          </div>
        </div>

        <div className="lg:col-span-5">
          {next ? (
            <div className="tb-sheet p-5 md:p-6">
              <h2 className="tb-title">{next.title}</h2>
              <p className="tb-body-s tb-c-ink2 mt-1">
                {started ? "Next session" : "First session"} · {next.type} · <span className="tb-num tb-num-m tb-c-ink">{next.minutes ?? "—"}</span> min · Week {pad(next.week)}
              </p>
              <Link href={next.href} className="tb-btn tb-btn-primary mt-5 w-full py-3 text-left">
                <Icon icon={Play} size={18} className="shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  {started ? "Continue" : "Start"}: {next.title}
                </span>
              </Link>
            </div>
          ) : null}

        </div>
      </header>

      {/* ---------- the plan table ---------- */}
      <section aria-labelledby="plan-h" className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="plan-h" className="tb-h2">The plan</h2>
          <p className="tb-meta tb-c-ink2">
            {model.modules.length} modules · {model.total} topics · {plan.weeksTotal} weeks
          </p>
        </div>
        <PlanTable model={model} thisWeek={thisWeek} started={started} />
        <div className="mt-3">
          <MockTag reason={`Which week each topic sits in — ${MOCK.due}. Titles, types, durations and locks are real.`} />
        </div>
      </section>

      <RaceDay model={model} plan={plan} cert={enrolment?.cert ?? "notpassing"} started={started} />

      <AroundThisPlan persona={persona} />
    </main>
  );
}
