"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ChevronDown, Lock } from "lucide-react";
import { getCoursePlan, type PlanModule, type PlanTopic } from "@/app/lab/training/course/six-sigma/plan-model";
import { MockTag } from "@/components/lab/MockTag";
import { Icon } from "@/lib/icons";
import { MOCK, getPersona } from "@/lib/lab/dashboard-mock";
import { NOT_WIRED, article, countWord, kindIcon, kindWord } from "./copy";
import { StackObject } from "./Objects";
import { Notice, Pill } from "./Pill";

function moduleWords(m: PlanModule, isCurrent: boolean) {
  const n = m.topics.length;
  const locked = m.topics.filter((t) => t.state === "locked").length;
  const lockedPart = locked ? ` · ${locked} locked until earlier lessons are done` : "";
  if (m.done === n) return `Done · all ${n} topics`;
  if (isCurrent) return `You are here · ${m.done} of ${n} done${lockedPart}`;
  if (m.done === 0) return `Not started · ${n} topics${lockedPart}`;
  return `${m.done} of ${n} done${lockedPart}`;
}

function topicMeta(t: PlanTopic) {
  const time = t.minutes ? `${t.minutes} min` : t.live ? t.duration : "";
  return [kindWord(t.type), time].filter(Boolean).join(" · ");
}

/** Course: a stack of slabs rising from the field, one per module; the current module open. */
export function CourseView() {
  const pid = useSearchParams().get("persona");
  const persona = getPersona(pid);
  const course = persona.enrolments.find((e) => e.id === "six-sigma");
  const plan = getCoursePlan(persona.id);
  const current = plan.nextModuleId ?? plan.modules[0]?.id;
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(current ? [current] : []));
  const [notice, setNotice] = React.useState("");
  const next = plan.next;
  const currentIndex = Math.max(0, plan.modules.findIndex((m) => m.id === current));

  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
      <section aria-labelledby="fd-h1" className="fd-wrap grid items-center gap-10 pb-28 pt-14 md:pb-36 md:pt-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 id="fd-h1" className="fd-display fd-c-white">
            {course?.title ?? "Six Sigma for Process Improvement"}
          </h1>
          <p className="fd-lede fd-c-white fd-num mt-6 md:mt-8">
            {plan.done ? `${plan.done} of ${plan.total} topics done.` : `${plan.total} topics, none started yet.`}{" "}
            {next && next.minutes
              ? `Next: “${next.title}”, ${article(next.minutes)} ${next.minutes}-minute ${kindWord(next.type).toLowerCase()}.`
              : next
                ? `Next: “${next.title}”.`
                : "Every topic is done."}
          </p>
          {plan.moved ? (
            <p className="fd-lede fd-c-white mt-3">
              After your break, {countWord(plan.moved)} topics moved a week later. Nothing was dropped.
            </p>
          ) : null}
          {next ? (
            <div className="mt-10">
              <Pill
                label={plan.done ? "Continue" : "Start"}
                href={next.href}
                onUnwired={() => setNotice(`${NOT_WIRED}: this topic has no page in the lab.`)}
              />
              <Notice text={notice} />
            </div>
          ) : null}
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <StackObject current={currentIndex} count={plan.modules.length} />
        </div>
      </section>

      <div className="fd-stack flex flex-1 flex-col">
        {plan.modules.map((m, i) => {
          const isOpen = open.has(m.id);
          const isCurrent = m.id === current;
          const last = i === plan.modules.length - 1;
          return (
            <section
              key={m.id}
              aria-labelledby={`fd-m-${m.id}`}
              className={`fd-slab ${i % 2 === 1 ? "fd-slab--white" : ""} ${last ? "flex-1 pb-16 md:pb-20" : ""} pt-6 md:pt-10`}
            >
              <div className="fd-wrap">
                <h2 id={`fd-m-${m.id}`}>
                  <button
                    type="button"
                    className="fd-disclose py-2"
                    aria-expanded={isOpen}
                    aria-controls={`fd-p-${m.id}`}
                    onClick={() => toggle(m.id)}
                  >
                    <span className={`fd-well fd-well--num h-12 w-12 md:h-14 md:w-14 ${isCurrent ? "fd-well--next" : ""}`} aria-hidden>
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="sr-only">Module {i + 1}: </span>
                      <span className="fd-h2 block">{m.title}</span>
                      <span className="fd-body fd-c-ink2 fd-num mt-2 block">{moduleWords(m, isCurrent)}</span>
                    </span>
                    <span className="fd-disclose__chev" aria-hidden>
                      <Icon icon={ChevronDown} size={20} />
                    </span>
                  </button>
                </h2>

                <div id={`fd-p-${m.id}`} hidden={!isOpen} className="pb-6 pt-4 md:pl-[72px]">
                  {m.lessons.map((l) => (
                    <div key={l.id} className="mt-4 first:mt-0">
                      {l.label ? <h3 className="fd-h3 mb-2 mt-6">{l.label}</h3> : null}
                      <ul className="fd-rows max-w-[920px]">
                        {l.topics.map((t) => (
                          <TopicRow key={t.id} t={t} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {last ? (
                  <MockTag
                    layout="block"
                    className="mt-10"
                    reason={`Which topics are done and the re-plan moves are persona fixtures; topics, types and locks are real course data. ${MOCK.due}. ${MOCK.pace}.`}
                  />
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function TopicRow({ t }: { t: PlanTopic }) {
  const locked = t.state === "locked";
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
      <span
        className={`fd-well h-10 w-10 ${t.state === "next" ? "fd-well--next" : t.state === "done" || locked ? "fd-well--quiet" : ""}`}
        aria-hidden
      >
        <Icon icon={t.state === "done" ? Check : locked ? Lock : kindIcon(t.type)} size={18} />
      </span>
      <div className="min-w-0 flex-1 basis-[200px]">
        {locked ? (
          <p className="fd-label fd-c-ink2">{t.title}</p>
        ) : (
          <Link href={t.href} className="fd-link fd-label inline-flex min-h-[44px] items-center">
            {t.title}
          </Link>
        )}
        <p className="fd-meta fd-c-ink2 fd-num">
          {topicMeta(t)}
          {t.movedFrom !== undefined ? ` · moved to week ${t.week}` : ""}
        </p>
      </div>
      <p className="fd-meta fd-c-ink2 max-w-full">
        {t.state === "next" ? <span className="fd-chip-next">Up next</span> : null}
        {t.state === "done" ? "Done" : null}
        {locked ? `Locked · finish “${t.lockedBy}” first` : null}
      </p>
    </li>
  );
}
