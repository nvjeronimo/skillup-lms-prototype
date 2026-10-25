"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** How far past its place the page scrolls while the bar's ground goes from clear to solid. */
const GROUND_RAMP_PX = 24;

/**
 * A page's tabs and filters, kept at hand (Nelson, 24 Oct 2026: My Learning and Calendar). In its
 * place the row scrolls with the page; once the learner has scrolled past it, it stays stuck to the
 * top of the window ("os tabs e os filtros podem ficar sempre fixos"). Stuck, it sits on the page
 * ground (bg/faint) with a border/subtle rule under it, and anything marked `data-hide-when-stuck`
 * (the My Learning search: "o search podes ocultar") steps out; `bleed` takes the ground to the
 * window's edges.
 * The ground follows the scroll, not a clock (25 Oct 2026, second pass): over the first
 * GROUND_RAMP_PX scrolled past the row it goes from clear to solid (`--sk-stuck`, 0 to 1), so the
 * cards never slide under a bar that is still see-through, and scrolling back clears it at the
 * finger's pace. The search folds on the stuck flag (globals.css).
 */
export function StickyToolbar({
  children,
  className,
  bleed = false,
}: {
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = React.useState(false);

  // Stuck: the line where the row starts has left the top of the window. The ground's opacity is
  // written straight to the style, once a frame, so scrolling never re-renders the bar.
  React.useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const top = sentinelRef.current?.getBoundingClientRect().top ?? 0;
      const ramp = Math.min(1, Math.max(0, -top / GROUND_RAMP_PX));
      barRef.current?.style.setProperty("--sk-stuck", String(ramp));
      setStuck(top < 0);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <div
        ref={barRef}
        data-sticky-toolbar=""
        data-stuck={stuck || undefined}
        className={cn(
          // The ground and its rule are a layer under the content (::before, globals.css) whose
          // opacity follows the scroll: never a hard switch, never see-through over the cards.
          "sk-sticky-toolbar sticky top-[env(safe-area-inset-top,0px)] z-20 -my-3 py-3",
          bleed && "mx-[calc(50%-50vw)] px-[calc(50vw-50%)]",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
