"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MockTag } from "@/components/lab/MockTag";
import { getPersona } from "@/lib/lab/dashboard-mock";
import { getCoursePlan, type PlanModule, type PlanTopic } from "@/app/lab/training/course/six-sigma/plan-model";
import { Action } from "./Actions";
import { Horizon } from "./Horizon";
import { PHASES, phaseOfLight, phaseOfPct } from "./light";

type ModuleState = "done" | "current" | "ahead";

function topicMeta(t: PlanTopic) {
  const parts = [t.type, t.duration].filter(Boolean);
  if (t.movedFrom !== undefined) parts.push("moved a week later in your re-plan");
  return parts.join(" · ");
}

function stateWord(t: PlanTopic) {
  if (t.state === "done") return "Done";
  if (t.state === "next") return "Up next";
  if (t.state === "locked") return "Locked";
  if (t.live) return "Live session";
  return null;
}

function TopicRow({ t }: { t: PlanTopic }) {
  const word = stateWord(t);
  const inner = (
    <>
      <span className="min-w-0">
        <span className={`dw-topic-title dw-body block ${t.state === "done" || t.state === "locked" ? "dw-fg-2" : ""}`}>{t.title}</span>
        <span className="dw-meta dw-fg-3 mt-0.5 block">
          {t.state === "locked" && t.lockedBy ? `Opens after ${t.lockedBy}` : topicMeta(t)}
        </span>
      </span>
      {word ? <span className={`dw-state ${t.state === "next" ? "dw-state--next" : "dw-fg-2"}`}>{word}</span> : <span />}
    </>
  );
  if (t.state === "locked") {
    return (
      <div className="dw-topic dw-rule-t" data-state={t.state}>
        {inner}
      </div>
    );
  }
  return (
    <Link href={t.href} className="dw-topic dw-rule-t" data-state={t.state} aria-current={t.state === "next" ? "step" : undefined}>
      {inner}
    </Link>
  );
}

/** Course: modules stacked as horizons — done in day, the current one at dawn and open, the rest still at night. */
export function CourseView() {
  const personaParam = useSearchParams().get("persona");
  const persona = getPersona(personaParam);
  const plan = getCoursePlan(persona.id);
  const enrolment = persona.enrolments.find((e) => e.id === "six-sigma");
  const pct = enrolment?.pct ?? Math.round((plan.done / plan.total) * 100);
  const coursePhase = phaseOfPct(pct);
  const next = plan.next;

  const stateOf = (m: PlanModule): ModuleState =>
    m.done === m.topics.length ? "done" : m.id === plan.nextModuleId ? "current" : "ahead";

  return (
    <main id="main" tabIndex={-1} className="flex-1 outline-none">
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-12 md:px-10 md:pb-14 md:pt-20">
        <h1 className="dw-h1 max-w-[20ch]">Six Sigma for Process Improvement</h1>
        <p className="dw-lede dw-fg-2 mt-4">
          <span className="dw-phase dw-fg">{coursePhase.word}</span>
          {" · "}
          {pct === 0 ? "not started" : <><span className="dw-num">{pct}%</span> complete</>}
          {" · "}
          <span className="dw-num">{plan.done}</span> of <span className="dw-num">{plan.total}</span> topics done
        </p>
      </div>

      <ol aria-label="Modules">
        {plan.modules.map((m, i) => {
          const state = stateOf(m);
          const count = m.topics.length;
          const light = state === "done" ? 1 : state === "current" ? 0.45 + 0.5 * (m.done / count) : 0;
          const phase = state === "done" ? PHASES.day : state === "current" ? phaseOfLight(light) : PHASES.night;
          const id = `dw-module-${m.id}`;
          const status =
            state === "done" ? "Complete" : state === "current" ? "In progress" : m.topics.some((t) => t.state === "locked") ? "Not started · part of it opens later" : "Not started";
          return (
            <Horizon
              key={m.id}
              as="li"
              size="module"
              index={i}
              light={light}
              phase={phase}
              labelledBy={id}
              sky={
                <div className="mx-auto w-full max-w-[1200px] px-4 pb-14 pt-6 md:px-10 md:pb-16 md:pt-8">
                  <h2 id={id} className="dw-h2 max-w-[28ch]">
                    {m.title}
                  </h2>
                </div>
              }
            >
              <div className="mx-auto w-full max-w-[1200px] px-4 py-5 md:px-10 md:py-6">
                <p className="dw-body">
                  <span className="dw-phase">{phase.word}</span>
                  <span className="dw-fg-2">
                    {" · "}Module {i + 1} of {plan.modules.length} · {status} · <span className="dw-num">{m.done}</span> of{" "}
                    <span className="dw-num">{count}</span> topics done
                  </span>
                </p>

                {state === "current" && next ? (
                  <div className="pb-6">
                    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-10">
                      <p id="dw-next" className="dw-lede max-w-[60ch]">
                        <span className="dw-fg-2">Up next: </span>
                        {next.title}
                        <span className="dw-fg-2">
                          {" · "}
                          {next.type}
                          {next.duration ? ` · ${next.duration}` : ""}
                        </span>
                      </p>
                      <Action variant="primary" label={plan.done === 0 ? "Start" : "Continue"} href={next.href} describedBy="dw-next" />
                    </div>

                    <div className="mt-8 max-w-[780px]">
                      {m.lessons.map((l) => (
                        <div key={l.id} className="mt-6 first:mt-0">
                          {l.label ? <h3 className="dw-h3 mb-2">{l.label}</h3> : null}
                          <ol aria-label={l.label ? `${l.label} topics` : `${m.title} topics`}>
                            {l.topics.map((t) => (
                              <li key={t.id}>
                                <TopicRow t={t} />
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </Horizon>
          );
        })}
      </ol>

      <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-12 md:px-10">
        <MockTag
          layout="block"
          reason="Modules, lessons, topics, types, durations and locks are the real course data; which topics this persona has done and the re-plan moves are mocked (no schedule or cohort-pace API)."
        />
      </div>
    </main>
  );
}
