"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Artwork } from "./Artwork";
import { Colophon } from "./Colophon";
import { NotWired } from "./NotWired";
import {
  BASE,
  FINISHED_MOCK,
  MOCK,
  SIX_SIGMA,
  getPersona,
  liveToday,
  medium,
  mockReason,
  nextAction,
  numberWord,
  q,
  returnNote,
  sixSigmaNow,
} from "./model";

/**
 * Home: the exhibition you are in. The artwork, large; the wall label that says which room you are in
 * and what hangs next; one Continue.
 */
export function HomeView() {
  const params = useSearchParams();
  const p = getPersona(params.get("persona"));
  const e = nextAction(p);

  if (!e) {
    return (
      <main id="main" tabIndex={-1} className="ex-wall flex-1 outline-none">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-10">
          <h1 className="ex-poster">Between exhibitions</h1>
          <p className="ex-lead ex-c-onwall2 mt-6 max-w-xl">Nothing is on view for you right now. Past exhibitions stay in My Learning.</p>
        </div>
      </main>
    );
  }

  const isSix = e.id === SIX_SIGMA;
  const now = isSix ? sixSigmaNow(p.id) : undefined;
  const started = now ? now.started : e.status === "in-progress";
  const roomNo = now ? now.roomIndex + 1 : undefined;
  const rooms = now?.plan.modules.length;
  const note = returnNote(p, e, started);
  const live = isSix ? liveToday(p, "Six Sigma") : null;

  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
      <div className="ex-wall flex-1 overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1240px] gap-x-16 gap-y-10 px-4 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
          <div className="lg:col-start-2 lg:row-start-1">
            <h1 className="ex-poster">{e.title}</h1>
            {rooms ? <p className="ex-lead ex-c-onwall2 mt-5">An exhibition in {numberWord(rooms)} rooms.</p> : null}
          </div>

          <Artwork seed={e.id} lightUp className="mx-auto w-full max-w-[520px] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:self-end" />

          <section aria-labelledby="ex-now" className="ex-card w-full max-w-[520px] p-6 md:p-8 lg:col-start-2 lg:row-start-2 lg:self-end">
            {now && now.topic && roomNo ? (
              <>
                <h2 id="ex-now" className="ex-room-no ex-c-wall">
                  {started ? `Now in Room ${roomNo}` : `Begin in Room ${roomNo}`}
                </h2>
                <p className="ex-work mt-4">{now.topic.title}</p>
                <p className="ex-meta ex-c-ink2 mt-2">{medium(now.topic)}</p>
                <Link href={now.topic.href} className="ex-btn mt-7 w-full sm:w-auto">
                  {started ? "Continue" : "Begin"}
                  <span className="sr-only">: {now.topic.title}</span>
                  <Icon icon={ArrowRight} size={20} aria-hidden="true" />
                </Link>
                {note || live ? (
                  <div className="ex-body ex-c-ink2 mt-6 space-y-2">
                    {note ? <p>{note}</p> : null}
                    {live ? <p>{live}</p> : null}
                  </div>
                ) : null}
                <p className="ex-small ex-c-ink2 ex-rule-t mt-7 pt-4">
                  Room {roomNo} of {rooms}: {now.room?.title}.{" "}
                  <Link href={`${BASE}/course${q(p)}`} className="ex-link ex-c-ink whitespace-nowrap">
                    See the floor plan
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2 id="ex-now" className="ex-room-no ex-c-wall">
                  {started ? "On view now" : "Opening soon"}
                </h2>
                {e.nextTopic ? (
                  <>
                    <p className="ex-work mt-4">{e.nextTopic.title}</p>
                    <p className="ex-meta ex-c-ink2 mt-2">{e.nextTopic.type}</p>
                  </>
                ) : null}
                <div className="mt-7">
                  <NotWired label={started ? "Continue" : "Begin"} context={e.title} />
                </div>
                {note ? <p className="ex-body ex-c-ink2 mt-6">{note}</p> : null}
              </>
            )}
          </section>
        </div>
      </div>
      <Colophon reason={mockReason([isSix && FINISHED_MOCK, live && MOCK.live])} />
    </main>
  );
}
