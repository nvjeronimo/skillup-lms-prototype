"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A page's tabs and filters, kept at hand (Nelson, 24 Oct 2026: My Learning and Calendar). In its
 * place the row scrolls with the page; once the learner has scrolled past it, it stays stuck to the
 * top of the window ("os tabs e os filtros podem ficar sempre fixos"). Stuck, it sits on the page
 * ground (bg/faint) with a border/subtle rule under it, and anything marked `data-hide-when-stuck`
 * (the My Learning search: "o search podes ocultar") steps out; `bleed` takes the ground to the
 * window's edges.
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

  // Stuck: the line where the row starts has left the top of the window.
  React.useEffect(() => {
    const measure = () => setStuck((sentinelRef.current?.getBoundingClientRect().top ?? 0) < 0);
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <div
        data-sticky-toolbar=""
        data-stuck={stuck || undefined}
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
