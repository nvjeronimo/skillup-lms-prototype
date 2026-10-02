"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { MockTag } from "@/components/lab/MockTag";
import { Icon } from "@/lib/icons";
import { Deck } from "./Deck";
import { NowPlaying } from "./NowPlaying";
import { PlayIcon } from "./PlayIcon";
import { SIX_SIGMA_ID, getSixSigmaAlbum, hoursMinutes, lastPlayed, pad2, trackTime, typeWord, type Track } from "./album-data";

/** The state column: said in words, with an icon beside the word, never colour alone. */
function TrackState({ t }: { t: Track }) {
  if (t.state === "done")
    return (
      <span className="al-small al-c-ink2 inline-flex items-center gap-1.5">
        <Icon icon={Check} size={16} aria-hidden="true" />
        Played
      </span>
    );
  if (t.state === "next")
    return (
      <span className="al-small al-strong al-c-teal inline-flex items-center gap-1.5">
        <PlayIcon size={14} />
        Up next
      </span>
    );
  if (t.state === "locked")
    return (
      <span className="al-small al-c-ink3 inline-flex items-center gap-1.5">
        <Icon icon={Lock} size={16} aria-hidden="true" />
        Locked
      </span>
    );
  return null;
}

function TrackRow({ t }: { t: Track }) {
  const time = trackTime(t);
  const meta = [typeWord(t.type), time].filter(Boolean).join(" · ");
  const body = (
    <>
      <span className="al-counter al-c-ink3">{pad2(t.no)}</span>
      <span className="min-w-0">
        <span className="al-track block">{t.title}</span>
        <span className="al-small al-c-ink2 mt-0.5 block lg:hidden">{meta}</span>
        {t.state === "locked" && t.lockedBy ? (
          <span className="al-small al-c-ink3 mt-0.5 block">Opens after {t.lockedBy}</span>
        ) : null}
      </span>
      <span className="al-small al-c-ink2 hidden lg:block">{typeWord(t.type)}</span>
      <span className="al-counter al-c-ink2 hidden text-right lg:block">{time}</span>
      <span className="text-right">
        <TrackState t={t} />
      </span>
    </>
  );
  if (t.state === "locked") {
    return (
      <div className="al-row" data-state="locked">
        {body}
      </div>
    );
  }
  return (
    <Link href={t.href} className="al-row" data-state={t.state}>
      {body}
    </Link>
  );
}

/** The course: the sleeve, then the tracklist side by side. */
export function CourseView() {
  const persona = useSearchParams().get("persona");
  const album = getSixSigmaAlbum(persona);
  const playRef = React.useRef<HTMLAnchorElement>(null);
  const next = album.next;
  const started = album.done > 0 || album.enrolment?.status === "in-progress";
  const label = started ? "Continue" : "Start";
  const sides = album.sides.length;

  return (
    <>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-40 pt-8 outline-none md:px-8 md:pt-14">
        <section aria-labelledby="al-sleeve" className="grid items-center gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:gap-14">
          <Deck id={SIX_SIGMA_ID} className="max-w-[500px]" />
          <div className="min-w-0">
            <h1 id="al-sleeve" className="al-display-m">
              {album.title}
            </h1>
            <p className="al-lede mt-5">By {album.provider}</p>
            <p className="al-counter-l al-c-ink2 mt-4">
              {album.total} tracks · {sides} sides · {hoursMinutes(album.knownMinutes)}
            </p>
            {album.untimed ? (
              <p className="al-small al-c-ink3 mt-1">
                {album.untimed} tracks have no listed time, so the total is at least this long.
              </p>
            ) : null}
            <p className="al-body al-c-ink2 mt-5">
              {lastPlayed(album.enrolment)}.{album.done > 0 ? ` ${album.done} of ${album.total} tracks played.` : ""}
            </p>
            {next ? (
              <>
                <p className="al-body mt-6">
                  <span className="al-strong">Up next:</span> track {pad2(next.no)}, {next.title}
                </p>
                <Link ref={playRef} href={next.href} className="al-play mt-4">
                  <span className="al-play-disc">
                    <PlayIcon />
                  </span>
                  {label}
                  <span className="sr-only">: {next.title}</span>
                </Link>
              </>
            ) : null}
          </div>
        </section>

        <div className="mt-16 max-w-[960px] md:mt-24">
          {album.sides.map((side) => (
            <section key={side.module.id} aria-labelledby={`al-side-${side.letter}`} className="mt-14 first:mt-0">
              <div className="al-rule-b flex items-end gap-4 pb-4 md:gap-6">
                <span className="al-side-letter" aria-hidden="true">
                  {side.letter}
                </span>
                <div className="min-w-0 pb-1">
                  <h2 id={`al-side-${side.letter}`} className="al-h2">
                    <span className="sr-only">Side {side.letter}: </span>
                    {side.module.title}
                  </h2>
                  <p className="al-counter al-c-ink2 mt-1">
                    {side.done} of {side.total} played
                  </p>
                </div>
              </div>
              {side.lessons.map((lesson) => (
                <div key={lesson.id}>
                  {lesson.label ? <h3 className="al-h3 al-c-ink2 mt-8 px-3 pb-1">{lesson.label}</h3> : null}
                  <ol className="mt-1">
                    {lesson.tracks.map((t) => (
                      <li key={t.id}>
                        <TrackRow t={t} />
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </section>
          ))}
        </div>

        <MockTag
          layout="block"
          className="mt-16"
          reason="Which tracks each persona has played is mocked. Titles, types, times, sides and locks are the real course data."
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
