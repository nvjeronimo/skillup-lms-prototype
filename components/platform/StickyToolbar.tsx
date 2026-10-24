"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A page's tabs and filters, kept at hand (Nelson, 24 Oct 2026: My Learning and Calendar "fix the tabs
 * and the filter on scroll up"). In its place the row scrolls with the page. Once the learner has
 * scrolled past it, it sticks to the top of the window: it slides away while they scroll down and
 * comes back on any scroll up, as the phone tab bar does. Stuck, it sits on the page ground
 * (bg/faint) with a border/subtle rule under it; `bleed` takes that ground to the window's edges.
 * Under reduced motion it fades instead of sliding (globals.css).
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
  const [stuck, setStuck] = React.useState(false);
  const [goingDown, setGoingDown] = React.useState(false);

  // Stuck: the line where the row starts has left the top of the window. The direction of the scroll
  // uses the tab bar's dead zone, so a resting finger does not flicker it.
  React.useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const measure = () => {
      const top = sentinelRef.current?.getBoundingClientRect().top ?? 0;
      setStuck(top < 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
        const y = window.scrollY;
        const delta = y - last;
        if (delta > 6) setGoingDown(true);
        else if (delta < -6) setGoingDown(false);
        if (Math.abs(delta) > 6) last = y;
      });
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  const hidden = stuck && goingDown;

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <div
        data-sticky-toolbar=""
        data-stuck={stuck || undefined}
        data-hidden={hidden || undefined}
        // Keyboard focus inside brings it back.
        onFocus={() => setGoingDown(false)}
        className={cn(
          "sk-sticky-toolbar sticky top-[env(safe-area-inset-top,0px)] z-20 -my-3 py-3",
          bleed && "mx-[calc(50%-50vw)] px-[calc(50vw-50%)]",
          stuck && "border-b border-sko-border-subtle bg-sko-bg-faint",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
