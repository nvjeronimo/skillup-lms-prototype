"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { MockTag } from "@/components/lab/MockTag";
import { Icon } from "@/lib/icons";
import type { Enrolment } from "@/lib/lab/dashboard-mock";
import { Cover } from "./Cover";
import { NowPlaying } from "./NowPlaying";
import { SIX_SIGMA_ID, enrolmentState, getSixSigmaAlbum } from "./album-data";

const ORDER: Record<Enrolment["status"], number> = { "in-progress": 0, "not-started": 1, locked: 2, completed: 3 };

/** A course without a page in this lab: a real button that says so, never a link to nowhere. */
function DemoTitle({ title }: { title: string }) {
  const [said, setSaid] = React.useState(false);
  return (
    <>
      <h2 className="al-card-title mt-4">
        <button type="button" className="al-stretch text-left" onClick={() => setSaid(true)}>
          {title}
        </button>
      </h2>
      <p role="status" className="al-status al-small al-strong al-c-teal mt-1 empty:mt-0">
        {said ? "Lab demo — not wired" : ""}
      </p>
    </>
  );
}

/** My Learning: the record shelf. */
export function LearningView() {
  const persona = useSearchParams().get("persona");
  const album = getSixSigmaAlbum(persona);
  const q = persona ? `?persona=${encodeURIComponent(persona)}` : "";
  const shelf = [...album.persona.enrolments].sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  const next = album.next;
  const count = shelf.length === 1 ? "One course" : `${shelf.length} courses`;

  return (
    <>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-40 pt-10 outline-none md:px-8 md:pt-16">
        <h1 className="al-display-m">My Learning</h1>
        <p className="al-lede al-c-ink2 mt-4">{count} on your shelf.</p>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-14 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {shelf.map((e) => {
            const six = e.id === SIX_SIGMA_ID;
            const done = six ? album.done : e.topicsDone;
            const total = six ? album.total : e.topicsTotal;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <li key={e.id} className="al-shelf-item" data-locked={e.status === "locked" ? "" : undefined}>
                <div className="al-sleeve">
                  <Cover id={e.id} />
                </div>
                <div className="al-groove mt-3" aria-hidden="true">
                  <span style={{ width: `${pct}%` }} />
                </div>
                {six ? (
                  <h2 className="al-card-title mt-4">
                    <Link href={`/lab/worlds/album/course${q}`} className="al-stretch">
                      {e.title}
                    </Link>
                  </h2>
                ) : (
                  <DemoTitle title={e.title} />
                )}
                <p className="al-counter al-c-ink2 mt-1.5">
                  {done} of {total} tracks
                </p>
                <p className="al-small al-c-ink2 mt-1 flex items-start gap-1.5">
                  {e.status === "locked" ? <Icon icon={Lock} size={16} aria-hidden="true" className="mt-0.5 shrink-0" /> : null}
                  <span>{enrolmentState(e)}</span>
                </p>
              </li>
            );
          })}
        </ul>

        <MockTag
          layout="block"
          className="mt-16"
          reason="Each persona's progress is sample data, and which Six Sigma tracks are played is mocked. In production the counts and states come from the edX Progress and Navigation APIs."
        />
      </main>
      {next ? (
        <NowPlaying
          coverId={SIX_SIGMA_ID}
          title={next.title}
          album={album.title}
          no={next.no}
          total={album.total}
          done={album.done}
          href={next.href}
          label={album.done > 0 || album.enrolment?.status === "in-progress" ? "Continue" : "Start"}
        />
      ) : null}
    </>
  );
}
