"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown, ArrowRight, Check, Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Artwork } from "./Artwork";
import { Colophon } from "./Colophon";
import {
  FINISHED_MOCK,
  SIX_SIGMA,
  getPersona,
  medium,
  mockReason,
  numberWord,
  sixSigmaNow,
  type PlanModule,
  type PlanTopic,
} from "./model";

const REPLAN_MOCK = "The re-plan after a break is lab data: edX has no schedule and no due dates";

/** How much wall a room takes on the plan: bigger rooms hold more labels, within reason. */
const roomWeight = (m: PlanModule) => Math.min(Math.max(m.topics.length, 3), 6);

function TopicLabel({ t, no }: { t: PlanTopic; no: string }) {
  if (t.state === "locked") {
    return (
      <li className="ex-label-closed p-5">
        <p className="ex-work-s">{t.title}</p>
        <p className="ex-meta mt-2">{medium(t)}</p>
        <p className="ex-small mt-4 flex items-start gap-2">
          <Icon icon={Lock} size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>
            {no} · Closed until you finish {t.lockedBy}
          </span>
        </p>
      </li>
    );
  }
  const state = t.state === "done" ? "Seen" : t.state === "next" ? "Next" : "Not yet seen";
  return (
    <li className="ex-card relative p-5">
      <p className="ex-work-s">
        <Link href={t.href} className="ex-stretch">
          {t.title}
        </Link>
      </p>
      <p className="ex-meta ex-c-ink2 mt-2">{medium(t)}</p>
      <p className="ex-small ex-c-ink2 mt-4 flex items-center gap-2">
        {t.state === "done" ? <Icon icon={Check} size={16} aria-hidden="true" className="shrink-0" /> : null}
        {t.state === "next" ? <span aria-hidden className="ex-here-dot shrink-0" /> : null}
        <span className={cn(t.state === "next" && "ex-c-teal ex-strong")}>
          {no} · {state}
        </span>
      </p>
    </li>
  );
}

/**
 * The course page: the floor plan of the exhibition. The room you are in is lit; choosing a room shows
 * its room text and its wall labels. The room text of the room you are in holds the one Continue.
 */
export function CourseView() {
  const params = useSearchParams();
  const p = getPersona(params.get("persona"));
  const e = p.enrolments.find((x) => x.id === SIX_SIGMA);
  const now = sixSigmaNow(p.id);
  const { plan } = now;
  const lit = plan.next ? now.roomIndex : -1;
  const [viewing, setViewing] = useState(Math.max(lit, 0));
  const room = plan.modules[viewing];
  const roomNo = viewing + 1;
  const moved = room.topics.filter((t) => t.movedFrom !== undefined).length;
  let n = 0;

  const roomState = (m: PlanModule, i: number) =>
    i === lit ? (now.started ? "You are here" : "Start here") : m.done === m.topics.length ? "Visited" : "Not yet visited";

  const title = e?.title ?? "Six Sigma for Process Improvement";
  const rooms = plan.modules.length;

  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
      <div className="ex-wall flex-1 overflow-hidden">
        <div className="mx-auto w-full max-w-[1240px] px-4 pb-20 pt-10 md:px-10 md:pt-16">
          <div className="flex items-end justify-between gap-12">
            <div className="max-w-[760px]">
              <h1 className="ex-poster">{title}</h1>
              <p className="ex-lead ex-c-onwall2 mt-5">
                An exhibition in {numberWord(rooms)} rooms and {plan.total} wall labels.{" "}
                {now.started ? `You have seen ${plan.done} of them.` : "You have not been in yet; it starts at the entrance."}
              </p>
            </div>
            <Artwork seed={SIX_SIGMA} className="hidden w-[168px] shrink-0 lg:block" />
          </div>

          {/* ---------- the floor plan ---------- */}
          <section aria-labelledby="ex-plan-h" className="mt-14 md:mt-20">
            <h2 id="ex-plan-h" className="ex-h2">
              Floor plan
            </h2>
            <p className="ex-body ex-c-onwall2 mt-1">Choose a room to read its wall labels.</p>
            <p className="ex-small ex-c-onwall2 mt-6 flex items-center gap-1.5 pl-8">
              <Icon icon={ArrowDown} size={16} aria-hidden="true" />
              Entrance
            </p>
            <ol className="ex-plan mt-2">
              {plan.modules.map((m, i) => {
                const isLit = i === lit;
                const isViewing = i === viewing;
                return (
                  <li
                    key={m.id}
                    className="ex-room isolate"
                    data-lit={isLit}
                    data-viewing={isViewing}
                    style={{ flexGrow: roomWeight(m) }}
                  >
                    {isLit ? <span aria-hidden className="ex-room-light ex-roomup" /> : null}
                    <button
                      type="button"
                      className="ex-room-btn flex h-full min-h-[9.5rem] w-full flex-col items-start gap-2 p-5 text-left md:p-6"
                      aria-pressed={isViewing}
                      aria-controls="ex-labels"
                      aria-current={isLit ? "location" : undefined}
                      onClick={() => setViewing(i)}
                    >
                      <span className="ex-room-no">Room {i + 1}</span>
                      <span className="ex-room-title ex-body ex-strong max-w-[30ch]">{m.title}</span>
                      <span className={cn("ex-small mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3", isLit ? "ex-c-ink2" : "ex-c-onwall2")}>
                        {isLit ? <span aria-hidden className="ex-here-dot" /> : null}
                        <span className={cn(isLit && "ex-c-teal ex-strong")}>{roomState(m, i)}</span>
                        <span aria-hidden>·</span>
                        <span>
                          {m.done} of {m.topics.length} labels seen
                        </span>
                        {isViewing ? (
                          <>
                            <span aria-hidden>·</span>
                            <span className={cn(isLit ? "ex-c-ink" : "ex-c-onwall", "ex-strong")}>Shown below</span>
                          </>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ---------- the room you chose: its room text, then its wall labels ---------- */}
          <section id="ex-labels" aria-labelledby="ex-room-h" className="mt-14 md:mt-20">
            <div className="ex-card max-w-[720px] p-6 md:p-8">
              <h2 id="ex-room-h">
                <span className="ex-room-no ex-c-wall block">Room {roomNo}</span>
                <span className="ex-h2 mt-2 block">{room.title}</span>
              </h2>
              <p className="ex-body ex-c-ink2 mt-3">
                {roomState(room, viewing)}. {room.done} of {room.topics.length} wall labels seen.
                {moved
                  ? ` After your break, ${numberWord(moved)} labels here moved a week later in your plan. Nothing was removed.`
                  : ""}
              </p>
              {viewing === lit && plan.next ? (
                <div className="ex-rule-t mt-6 pt-6">
                  <p className="ex-work">{plan.next.title}</p>
                  <p className="ex-meta ex-c-ink2 mt-2">{medium(plan.next)}</p>
                  <Link href={plan.next.href} className="ex-btn mt-6 w-full sm:w-auto">
                    {now.started ? "Continue" : "Begin"}
                    <span className="sr-only">: {plan.next.title}</span>
                    <Icon icon={ArrowRight} size={20} aria-hidden="true" />
                  </Link>
                </div>
              ) : null}
            </div>

            {room.lessons.map((l) => (
              <div key={l.id} className="mt-12">
                {l.label ? <h3 className="ex-h2 mb-5">{l.label}</h3> : null}
                <ol className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", !l.label && "mt-0")}>
                  {l.topics.map((t) => {
                    n += 1;
                    return <TopicLabel key={t.id} t={t} no={`${roomNo}.${n}`} />;
                  })}
                </ol>
              </div>
            ))}
          </section>
        </div>
      </div>
      <Colophon reason={mockReason([FINISHED_MOCK, plan.moved > 0 && REPLAN_MOCK])} />
    </main>
  );
}
