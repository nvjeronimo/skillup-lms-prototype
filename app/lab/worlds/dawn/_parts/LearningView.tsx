"use client";

import { useSearchParams } from "next/navigation";
import { MockTag } from "@/components/lab/MockTag";
import { getPersona, nextAction, type Enrolment } from "@/lib/lab/dashboard-mock";
import { Action } from "./Actions";
import { Horizon } from "./Horizon";
import { BASE, PHASES, personaQuery, phaseOfPct } from "./light";

function detail(e: Enrolment) {
  if (e.status === "locked") return `Opens when you finish ${e.lockedBy ?? "the course before it"}`;
  if (e.status === "completed") {
    if (e.cert === "downloadable") return "Complete · your certificate is ready";
    if (e.cert === "generating") return "Complete · your certificate is being prepared";
    return "Complete";
  }
  if (e.status === "not-started") return e.lastActive === "Never opened" ? "Not opened yet" : `Enrolled · last opened ${e.lastActive.toLowerCase()}`;
  return `Last active ${e.lastActive.toLowerCase()}`;
}

/** My Learning: every course is a horizon band at its own light, its phase in words, one action each. */
export function LearningView() {
  const personaParam = useSearchParams().get("persona");
  const p = getPersona(personaParam);
  const q = personaQuery(personaParam);
  const next = nextAction(p);

  const actionFor = (e: Enrolment) => {
    const primary = next?.id === e.id;
    const variant = primary ? "primary" : "quiet";
    if (e.status === "locked") return null;
    if (e.id === "six-sigma") return <Action variant={variant} label={e.pct === 0 ? "Start course" : "Open course"} href={`${BASE}/course${q}`} />;
    if (e.status === "completed")
      return <Action variant={variant} label={e.cert === "downloadable" ? "View certificate" : "Review course"} />;
    return <Action variant={variant} label={e.status === "not-started" ? "Start course" : "Continue"} />;
  };

  return (
    <main id="main" tabIndex={-1} className="flex-1 outline-none">
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-12 md:px-10 md:pb-14 md:pt-20">
        <h1 className="dw-h1">My Learning</h1>
        <p className="dw-lede dw-fg-2 mt-4 max-w-[52ch]">
          Each course is lit by how much of it you have finished: night before you start, first light and dawn as you
          go, full day when it is done.
        </p>
      </div>

      <ol aria-label="Your courses">
        {p.enrolments.map((e, i) => {
          const phase = e.status === "locked" ? PHASES.night : phaseOfPct(e.pct);
          const id = `dw-course-${e.id}`;
          return (
            <Horizon
              key={e.id}
              as="li"
              size="band"
              index={i}
              light={e.status === "locked" ? 0 : e.pct / 100}
              phase={phase}
              labelledBy={id}
              sky={
                <div className="mx-auto w-full max-w-[1200px] px-4 pb-20 pt-7 md:px-10 md:pb-24 md:pt-9">
                  <h2 id={id} className="dw-h2 max-w-[24ch]">
                    {e.title}
                  </h2>
                </div>
              }
            >
              <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-6">
                <div>
                  <p className="dw-body">
                    <span className="dw-phase">{phase.word}</span>
                    <span className="dw-fg-2">
                      {" · "}
                      <span className="dw-num">{e.pct}%</span> · <span className="dw-num">{e.topicsDone}</span> of{" "}
                      <span className="dw-num">{e.topicsTotal}</span> topics
                    </span>
                  </p>
                  <p className="dw-meta dw-fg-3 mt-1.5">{detail(e)}</p>
                </div>
                {actionFor(e)}
              </div>
            </Horizon>
          );
        })}
      </ol>

      <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-12 md:px-10">
        <MockTag
          layout="block"
          reason="Lab personas: progress, topic counts, certificate status and last activity are real edX fields filled with sample values; the phase names are a design reading of the %."
        />
      </div>
    </main>
  );
}
