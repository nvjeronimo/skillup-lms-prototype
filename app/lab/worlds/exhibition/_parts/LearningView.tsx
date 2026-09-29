"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Artwork } from "./Artwork";
import { Colophon } from "./Colophon";
import { NotWired } from "./NotWired";
import {
  BASE,
  FINISHED_MOCK,
  SIX_SIGMA,
  getPersona,
  medium,
  mockReason,
  nextAction,
  q,
  sixSigmaNow,
  wingOf,
  type Enrolment,
  type Persona,
  type Wing,
} from "./model";

const WINGS: { key: Wing; title: string }[] = [
  { key: "on-view", title: "On view" },
  { key: "coming-up", title: "Coming up" },
  { key: "past", title: "Past exhibitions" },
];

/** What the label says under the title, in words. Six Sigma speaks in rooms; the others in topics seen. */
function labelLines(p: Persona, e: Enrolment): { status: string; detail?: string } {
  if (e.id === SIX_SIGMA && (e.status === "in-progress" || e.status === "not-started")) {
    const now = sixSigmaNow(p.id);
    const rooms = now.plan.modules.length;
    const next = now.topic ? `${now.topic.title} · ${medium(now.topic)}` : undefined;
    if (!now.started) return { status: `Not yet opened · ${rooms} rooms`, detail: next ? `Begins with ${next}` : undefined };
    return { status: `Now in Room ${now.roomIndex + 1} of ${rooms}`, detail: next ? `Next: ${next}` : undefined };
  }
  const visited = e.lastActive && !["—", "Never opened"].includes(e.lastActive) ? `Last visit: ${e.lastActive.toLowerCase()}.` : undefined;
  switch (e.status) {
    case "in-progress":
      return { status: `${e.topicsDone} of ${e.topicsTotal} topics seen`, detail: visited };
    case "not-started":
      return { status: `Not yet opened · ${e.topicsTotal} topics` };
    case "locked":
      return { status: `Opens after you finish ${e.lockedBy}` };
    case "completed":
      return {
        status: e.cert === "downloadable" ? "Completed · certificate ready" : e.cert === "generating" ? "Completed · certificate being issued" : "Completed",
        detail: visited,
      };
  }
}

function WorkTitle({ p, e, big }: { p: Persona; e: Enrolment; big?: boolean }) {
  const cls = big ? "ex-work" : "ex-work-s";
  return (
    <h3 className={cls}>
      {e.id === SIX_SIGMA ? (
        <Link href={`${BASE}/course${q(p)}`} className="ex-link">
          {e.title}
        </Link>
      ) : (
        e.title
      )}
    </h3>
  );
}

function WorkAction({ p, e, primary }: { p: Persona; e: Enrolment; primary: boolean }) {
  if (e.status === "locked") return null;
  if (e.status === "completed") return e.cert === "downloadable" ? <NotWired label="View certificate" context={e.title} /> : null;
  const verb = e.status === "not-started" ? "Begin" : "Continue";
  if (e.id === SIX_SIGMA) {
    const now = sixSigmaNow(p.id);
    if (!now.topic) return null;
    return primary ? (
      <Link href={now.topic.href} className="ex-btn w-full sm:w-auto">
        {verb}
        <span className="sr-only">: {now.topic.title}</span>
        <Icon icon={ArrowRight} size={20} aria-hidden="true" />
      </Link>
    ) : (
      <Link href={now.topic.href} className="ex-btn-quiet">
        {verb}
        <span className="sr-only">: {now.topic.title}</span>
      </Link>
    );
  }
  return <NotWired label={verb} context={e.title} />;
}

/** The work you would walk back to: hung large, with the page's one primary action on its label. */
function Feature({ p, e }: { p: Persona; e: Enrolment }) {
  const l = labelLines(p, e);
  return (
    <div className="grid items-end gap-8 md:grid-cols-[minmax(0,460px)_minmax(0,440px)] md:gap-14">
      <Artwork seed={e.id} lightUp className="w-full max-w-[460px]" />
      <div className="ex-card max-w-[480px] p-6 md:p-8">
        <WorkTitle p={p} e={e} big />
        <p className="ex-meta mt-3">{l.status}</p>
        {l.detail ? <p className="ex-body ex-c-ink2 mt-1">{l.detail}</p> : null}
        <div className="mt-7">
          <WorkAction p={p} e={e} primary />
        </div>
      </div>
    </div>
  );
}

function SmallWork({ p, e }: { p: Persona; e: Enrolment }) {
  const l = labelLines(p, e);
  return (
    <li className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-4 sm:grid-cols-[132px_minmax(0,1fr)] md:block">
      <Artwork seed={e.id} className="w-full" />
      <div className="ex-card p-5 md:mt-6">
        <WorkTitle p={p} e={e} />
        <p className="ex-meta mt-2">{l.status}</p>
        {l.detail ? <p className="ex-small ex-c-ink2 mt-1">{l.detail}</p> : null}
        <div className="mt-4 empty:hidden">
          <WorkAction p={p} e={e} primary={false} />
        </div>
      </div>
    </li>
  );
}

/** My Learning: every exhibition the learner holds a ticket for, hung on one wall by wing. */
export function LearningView() {
  const params = useSearchParams();
  const p = getPersona(params.get("persona"));
  const next = nextAction(p);

  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
      <div className="ex-wall flex-1 overflow-hidden">
        <div className="mx-auto w-full max-w-[1240px] px-4 pb-20 pt-10 md:px-10 md:pt-16">
          <h1 className="ex-poster">My Learning</h1>
          <p className="ex-lead ex-c-onwall2 mt-5 max-w-xl">Every course you are enrolled in, hung as one work: what is on view, what is coming up, and what has closed.</p>

          {WINGS.map((w) => {
            const works = p.enrolments.filter((e) => wingOf(e) === w.key);
            if (!works.length) return null;
            const feature = works.find((e) => e.id === next?.id);
            const rest = works.filter((e) => e !== feature);
            return (
              <section key={w.key} aria-labelledby={`ex-wing-${w.key}`} className="ex-rule-t-wall mt-14 pt-6 md:mt-20">
                <h2 id={`ex-wing-${w.key}`} className="ex-room-no">
                  {w.title}
                </h2>
                {feature ? (
                  <div className="mt-8">
                    <Feature p={p} e={feature} />
                  </div>
                ) : null}
                {rest.length ? (
                  <ul className={cn("grid gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-4", feature ? "mt-14" : "mt-8")}>
                    {rest.map((e) => (
                      <SmallWork key={e.id} p={p} e={e} />
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
      <Colophon reason={mockReason([p.enrolments.some((e) => e.id === SIX_SIGMA) && FINISHED_MOCK])} />
    </main>
  );
}
