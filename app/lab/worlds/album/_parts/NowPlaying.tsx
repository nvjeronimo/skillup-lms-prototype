"use client";

import * as React from "react";
import Link from "next/link";
import { Cover } from "./Cover";
import { PlayIcon } from "./PlayIcon";
import { pad2 } from "./album-data";

export interface NowPlayingProps {
  coverId: string;
  title: string;
  album: string;
  no: number;
  total: number;
  done: number;
  href: string;
  label: string;
  /**
   * The page's own Play button. While it is on screen the bar stays tucked away, so there is only ever one
   * Play in view. Without it, the bar is always shown and is the page's action.
   */
  watch?: React.RefObject<HTMLElement>;
}

/** The mini player: the current track, docked to the bottom of the screen. */
export function NowPlaying({ coverId, title, album, no, total, done, href, label, watch }: NowPlayingProps) {
  const [shown, setShown] = React.useState(!watch);

  React.useEffect(() => {
    const el = watch?.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [watch]);

  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <aside aria-label="Now playing" className="al-bar" data-shown={shown ? "true" : "false"}>
      <div className="al-bar-groove" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-4 py-2.5 md:gap-4 md:px-8">
        <div className="al-sleeve w-12 shrink-0">
          <Cover id={coverId} grain={false} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="al-body al-strong line-clamp-2 sm:line-clamp-1">{title}</p>
          <p className="al-counter al-c-ink3 truncate">
            Track {pad2(no)} of {total}
            <span className="hidden sm:inline"> · {album}</span>
          </p>
        </div>
        <Link href={href} className="al-play al-play-sm shrink-0">
          <span className="al-play-disc">
            <PlayIcon size={14} />
          </span>
          {label}
          <span className="sr-only">: {title}</span>
        </Link>
      </div>
    </aside>
  );
}
