"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { MockTag } from "@/components/lab/MockTag";
import { Icon } from "@/lib/icons";
import { MOCK } from "@/lib/lab/dashboard-mock";
import { getPlan } from "@/lib/lab/training-plan";
import { NOT_WIRED, article, kindIcon } from "./copy";
import { SessionObject } from "./Objects";
import { Notice, Pill } from "./Pill";

/** Home: today's session is the headline, one white pill starts it, a cream slab holds what comes next. */
export function HomeView() {
  const plan = getPlan(useSearchParams().get("persona"));
  const [notice, setNotice] = React.useState("");
  const today = plan.today;

  const ti = plan.days.findIndex((d) => d.isToday);
  const upcoming = plan.days
    .slice(ti)
    .flatMap((d) => d.sessions.map((s) => ({ s, day: `${d.short} ${d.date} ${d.date >= 29 ? "Sep" : "Oct"}` })))
    .filter(({ s }) => s.state !== "today" && s.state !== "done" && s.state !== "missed")
    .slice(0, 3);
  const hasLive = upcoming.some(({ s }) => s.state === "live");

  const title = today?.title ?? "Nothing planned today";
  const kind = today?.kind.toLowerCase() ?? "";
  const start = plan.status.tone === "not-started";

  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
      <section aria-labelledby="fd-h1" className="fd-wrap grid items-center gap-10 pb-24 pt-14 md:pb-32 md:pt-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 id="fd-h1" className="fd-display fd-c-white">
            {title}
          </h1>
          {today ? (
            <p className="fd-lede fd-c-white mt-6 md:mt-8">
              Today: {article(today.minutes)} {today.minutes}-minute {kind} from {today.course}.
            </p>
          ) : null}
          <p className="fd-lede fd-c-white mt-3">{plan.status.line}</p>
          <div className="mt-10">
            <Pill
              label={start ? "Start" : "Continue"}
              href={today?.href}
              onUnwired={() => setNotice(`${NOT_WIRED}: this session has no page in the lab.`)}
            />
            <Notice text={notice} />
          </div>
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <SessionObject video={kind === "video"} />
        </div>
      </section>

      <section aria-labelledby="fd-next" className="fd-slab flex-1 pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="fd-wrap">
          <h2 id="fd-next" className="fd-h2">
            Next this week
          </h2>
          {upcoming.length ? (
            <ul className="fd-cols mt-8 grid md:mt-12 md:grid-cols-3">
              {upcoming.map(({ s, day }, i) => (
                <li key={s.id} className={i === 0 ? "py-6 md:py-0 md:pr-8" : "py-6 md:py-0 md:px-8"}>
                  <span className="fd-well h-14 w-14" aria-hidden>
                    <Icon icon={kindIcon(s.kind)} size={24} />
                  </span>
                  <h3 className="fd-h3 mt-5">{s.title}</h3>
                  <p className="fd-body fd-c-ink2 fd-num mt-2">
                    {day} · {s.kind} · {s.minutes} min
                  </p>
                  {s.state === "moved" ? <p className="fd-body fd-c-ink2 mt-1">Moved here from last week</p> : null}
                  {s.state === "live" ? <p className="fd-body fd-c-ink2 mt-1">Live at {s.time}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="fd-body fd-c-ink2 mt-6">Nothing else is planned this week.</p>
          )}
          <p className="fd-body fd-c-ink2 mt-10 md:mt-14">Your plan runs to your certificate date, {plan.raceDay}.</p>
          <MockTag
            layout="block"
            className="mt-10"
            reason={`Today's session, the week and the certificate date are a mocked plan. ${[MOCK.pace, MOCK.due, hasLive ? MOCK.live : null].filter(Boolean).join(". ")}.`}
          />
        </div>
      </section>
    </main>
  );
}
