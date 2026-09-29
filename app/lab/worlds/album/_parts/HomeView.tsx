"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MockTag } from "@/components/lab/MockTag";
import { MOCK } from "@/lib/lab/dashboard-mock";
import { getPlan, type Session } from "@/lib/lab/training-plan";
import { Cover } from "./Cover";
import { Deck } from "./Deck";
import { NowPlaying } from "./NowPlaying";
import { PlayIcon } from "./PlayIcon";
import { SIX_SIGMA_ID, coverIdFor, getSixSigmaAlbum, lastPlayed, pad2, trackTime, typeWord } from "./album-data";

/** The queue line under a session's title: course, kind, then its length or its start time. */
function queueMeta(s: Session): string {
  const when = s.state === "live" ? (s.time === "Live now" ? null : s.time) : `${s.minutes} min`;
  return [s.course, s.kind, when].filter(Boolean).join(" · ");
}

/** What changed about a session, in words. */
function queueNote(s: Session): string | null {
  if (s.state === "moved") return "Moved from last week";
  if (s.state === "live" && s.time === "Live now") return "Live now";
  return null;
}

/** Home: the record on the platter, and the short queue behind it. */
export function HomeView() {
  const persona = useSearchParams().get("persona");
  const album = getSixSigmaAlbum(persona);
  const plan = getPlan(persona);
  const playRef = React.useRef<HTMLAnchorElement>(null);
  const next = album.next;
  const started = album.done > 0 || album.enrolment?.status === "in-progress";
  const label = started ? "Continue" : "Start";

  const dayOf = (id: string) => {
    const d = plan.days.find((day) => day.sessions.some((s) => s.id === id));
    if (!d) return "";
    return d.isToday ? "Today" : d.short;
  };

  return (
    <>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-36 pt-8 outline-none md:px-8 md:pt-14">
        {next ? (
          <section aria-labelledby="al-now" className="grid items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-14">
            <Deck id={SIX_SIGMA_ID} slide className="max-w-[560px]" />
            <div className="min-w-0">
              <h1 id="al-now" className="al-display">
                {next.title}
              </h1>
              <p className="al-counter-l al-c-ink2 mt-5">
                Track {pad2(next.no)} of {album.total} · {typeWord(next.type)}
                {trackTime(next) ? ` · ${trackTime(next)}` : ""}
              </p>
              <p className="al-lede mt-6 max-w-[40ch]">
                From <span className="al-strong">{album.title}</span>, by {album.provider}
              </p>
              <p className="al-body al-c-ink2 mt-2">
                {lastPlayed(album.enrolment)}.{album.done > 0 ? ` ${album.done} of ${album.total} tracks played.` : ""}
              </p>
              <Link ref={playRef} href={next.href} className="al-play mt-8">
                <span className="al-play-disc">
                  <PlayIcon />
                </span>
                {label}
                <span className="sr-only">: {next.title}</span>
              </Link>
            </div>
          </section>
        ) : (
          <h1 className="al-display">Every track played</h1>
        )}

        {plan.then.length > 0 ? (
          <section aria-labelledby="al-queue" className="mt-16 max-w-[760px] md:mt-24">
            <h2 id="al-queue" className="al-h2">
              Up next
            </h2>
            {plan.replan ? <p className="al-body al-c-ink2 mt-2">{plan.replan.message}</p> : null}
            <ol className="al-rule-t mt-5">
              {plan.then.map((s) => {
                const note = queueNote(s);
                return (
                  <li key={s.id} className="al-rule-b flex items-center gap-4 py-4">
                    <div className="al-sleeve w-12 shrink-0">
                      <Cover id={coverIdFor(s.course)} grain={false} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="al-track">{s.title}</p>
                      <p className="al-small al-c-ink2">
                        {queueMeta(s)}
                        {note ? <span className="al-c-teal al-strong"> · {note}</span> : null}
                      </p>
                    </div>
                    <p className="al-counter al-c-ink2 shrink-0 text-right">{dayOf(s.id)}</p>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}

        <MockTag
          layout="block"
          className="mt-16"
          reason={`The queue is a mock week plan: ${MOCK.due}; ${MOCK.live}. Which tracks each persona has played is sample data.`}
        />
      </main>
      {next ? (
        <NowPlaying
          watch={playRef}
          coverId={SIX_SIGMA_ID}
          title={next.title}
          album={album.title}
          no={next.no}
          total={album.total}
          done={album.done}
          href={next.href}
          label={label}
        />
      ) : null}
    </>
  );
}
