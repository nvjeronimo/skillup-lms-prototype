"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Lock } from "lucide-react";
import { MockTag } from "@/components/lab/MockTag";
import { Icon } from "@/lib/icons";
import { getPersona, nextAction, type Enrolment } from "@/lib/lab/dashboard-mock";
import { NOT_WIRED, countWord, withPersona } from "./copy";
import { CourseMark } from "./Objects";
import { Notice, Pill } from "./Pill";

const COURSE_PAGE = "/lab/worlds/field/course";

function statusWords(e: Enrolment) {
  switch (e.status) {
    case "in-progress":
      return `In progress · ${e.topicsDone} of ${e.topicsTotal} topics done`;
    case "not-started":
      return `Not started · ${e.topicsTotal} topics`;
    case "locked":
      return `Locked until you finish ${e.lockedBy ?? "an earlier course"}`;
    default:
      return "Completed";
  }
}

function certWords(e: Enrolment) {
  if (e.cert === "downloadable") return "Certificate ready";
  if (e.cert === "generating") return "Certificate being prepared";
  return "No certificate for this course";
}

/** My Learning: the learner's courses as white capsules floating on the field; one pill picks up the next. */
export function LearningView() {
  const persona = useSearchParams().get("persona");
  const p = getPersona(persona);
  const next = nextAction(p);
  const [notice, setNotice] = React.useState("");
  const active = p.enrolments.filter((e) => e.status !== "completed");
  const finished = p.enrolments.filter((e) => e.status === "completed");
  const unwired = (what: string) => setNotice(`${NOT_WIRED}: ${what} has no page in this lab.`);

  const n = active.length;
  const lede = next
    ? next.status === "not-started"
      ? `Start ${next.title} with “${next.nextTopic?.title}”.`
      : `Pick up ${next.title} at “${next.nextTopic?.title}”.`
    : "Everything you enrolled in is finished.";

  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
      <div className="fd-wrap pb-20 pt-14 md:pb-28 md:pt-24">
        <h1 className="fd-display fd-c-white">My Learning</h1>
        <p className="fd-lede fd-c-white mt-6 md:mt-8">
          {n ? `${countWord(n).replace(/^./, (c) => c.toUpperCase())} ${n === 1 ? "course" : "courses"} on your list. ` : ""}
          {lede}
        </p>
        {next ? (
          <div className="mt-10">
            <Pill
              label={next.status === "not-started" ? "Start" : "Continue"}
              href={next.nextTopic?.href}
              onUnwired={() => unwired(`“${next.nextTopic?.title ?? next.title}”`)}
            />
          </div>
        ) : null}
        <Notice text={notice} />

        <section aria-labelledby="fd-open" className="mt-12 md:mt-16">
          <h2 id="fd-open" className="sr-only">
            Open courses
          </h2>
          <ul className="flex max-w-[1040px] flex-col gap-4 md:gap-5">
            {active.map((e, i) => (
              <li key={e.id} className="fd-course flex flex-wrap items-center gap-x-6 gap-y-4 p-5 md:flex-nowrap md:py-4 md:pl-4 md:pr-5">
                <CourseMark index={i} />
                <div className="min-w-0 flex-1 basis-[180px]">
                  <h3 className="fd-h3">{e.title}</h3>
                  <p className="fd-body fd-c-ink2 fd-num mt-1">{statusWords(e)}</p>
                  {e.status === "in-progress" ? (
                    <div className="fd-track mt-3 max-w-[360px]" aria-hidden>
                      <span style={{ width: `${e.pct}%` }} />
                    </div>
                  ) : null}
                </div>
                {e.status === "locked" ? (
                  <span className="fd-label fd-c-ink2 inline-flex min-h-[48px] items-center gap-2 pr-2">
                    <Icon icon={Lock} size={18} aria-hidden />
                    Locked
                  </span>
                ) : e.id === "six-sigma" ? (
                  <Link href={withPersona(COURSE_PAGE, persona)} className="fd-ghost" aria-label={`Open ${e.title}`}>
                    Open
                    <span className="fd-ghost__disc" aria-hidden>
                      <Icon icon={ChevronRight} size={20} />
                    </span>
                  </Link>
                ) : (
                  <button type="button" className="fd-ghost" aria-label={`Open ${e.title}`} onClick={() => unwired(e.title)}>
                    Open
                    <span className="fd-ghost__disc" aria-hidden>
                      <Icon icon={ChevronRight} size={20} />
                    </span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="fd-done" className="fd-slab flex-1 pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="fd-wrap">
          <h2 id="fd-done" className="fd-h2">
            Finished
          </h2>
          {finished.length ? (
            <ul className="fd-rows mt-8 max-w-[1040px]">
              {finished.map((e) => (
                <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                  <h3 className="fd-h3">{e.title}</h3>
                  <p className="fd-body fd-c-ink2">
                    {certWords(e)} · last opened {e.lastActive.toLowerCase()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="fd-body fd-c-ink2 mt-6 max-w-[52ch]">Courses you finish rest here, with their certificates.</p>
          )}
          <MockTag
            layout="block"
            className="mt-12"
            reason="Enrolments are persona fixtures shaped like the edX Progress and Navigation APIs; only Six Sigma has a course page in this lab."
          />
        </div>
      </section>
    </main>
  );
}
